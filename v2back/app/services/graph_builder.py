"""
GraphBuilder — ValueGraph CRUD үйлдлүүд.
JournalService-с тусгаарласан (SRP).

Архитектур:
  Maslow    → ValueNode   (need layer)
  Plutchik  → Emotion     (node дээр attach, confidence-weighted)
  Hawkins   → Edge        (value хоорондын energy, EWMA + recency decay)
  Tracker   → raw log
  Aggregated→ summarized state
"""

import math
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from itertools import combinations

from supabase import Client
from app.schemas.analysis import LlmAnalysisResult

# ── Тохиргоо ─────────────────────────────────────────────────────────────────
_EWMA_ALPHA        = 0.3    # Edge EWMA smoothing factor
_HAWKINS_PRIOR     = 200.0  # Neutral prior (Courage level) — cold start bias
_HAWKINS_PRIOR_SCR = 0.5    # Neutral prior score
_HALF_LIFE_DAYS    = 30.0   # Emotion recency decay — 30 хоногт жин хагасална
_WINDOW_DAYS       = 90     # Dominant emotion тооцох цонх (хоног)
_TRACKER_LIMIT     = 100    # Нэг emotion-н max tracker row
_MAX_NODES         = 8      # Нэг entry-н max node
_MAX_EDGES         = 10     # Нэг entry-н max edge (quadratic өсөлтөөс хамгаална)


@dataclass(frozen=True)
class _NodeSpec:
    category: str
    value: str
    confidence: float


class GraphBuilder:
    """ValueNode, ValueEdge болон Emotion tracker шинэчлэлт."""

    def __init__(self, db: Client) -> None:
        self._db = db

    # ── Public ───────────────────────────────────────────────────────────────

    def update_graph(
        self,
        user_id: str,
        analysis: LlmAnalysisResult,
        entry_id: str,
    ) -> None:
        """
        Single entry point — graph бүхэлд нь шинэчилнэ.

        1. Maslow  → NodeSpec parse
        2. Nodes   → batch upsert + hawkins accumulate
        3. Emotions → batch upsert, batch tracker insert, batch dominant update
        4. Edges   → batch SELECT, EWMA update эсвэл insert
        """
        specs = self._parse_specs(analysis)
        if not specs:
            return

        node_map = self._batch_upsert_nodes(user_id, specs, analysis)
        emotion_ids = self._batch_upsert_emotions(node_map, specs, entry_id, analysis)
        self._batch_update_dominant_emotions(emotion_ids)

        node_ids = list(node_map.values())
        pairs = list(combinations(node_ids, 2))[:_MAX_EDGES]
        self._batch_upsert_edges(pairs, entry_id, analysis)

    def fetch_graph(self, user_id: str) -> dict:
        """v_user_graph view-г ашиглан React Flow граф буцаана."""
        rows = (
            self._db.table("v_user_graph")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        ).data or []
        return _rows_to_graph(rows)

    # ── Private: Parse ────────────────────────────────────────────────────────

    def _parse_specs(self, analysis: LlmAnalysisResult) -> list[_NodeSpec]:
        """
        LlmAnalysisResult-с NodeSpec жагсаалт үүсгэнэ.
        Confidence-аар буурах дарааллаар, MAX_NODES-оор хязгаарлана.
        """
        specs: list[_NodeSpec] = []
        for item in analysis.maslow:
            category = item.get("category", "")
            for value_dict in item.get("values", []):
                for value, conf in value_dict.items():
                    try:
                        specs.append(_NodeSpec(category, value, float(conf)))
                    except (TypeError, ValueError):
                        pass
        return sorted(specs, key=lambda s: s.confidence, reverse=True)[:_MAX_NODES]

    # ── Private: Node ─────────────────────────────────────────────────────────

    def _batch_upsert_nodes(
        self,
        user_id: str,
        specs: list[_NodeSpec],
        analysis: LlmAnalysisResult,
    ) -> dict[tuple[str, str], str]:
        """
        Нэг SELECT-ээр бүх node-уудыг шалгаж,
        байгааг нь increment, байхгүйг нь insert хийнэ.

        v2: hawkins_level_sum / hawkins_entry_count хуримтална.
            → per-node energy signal — нэмэлт хүснэгт хэрэггүй.

        Returns:
            {(category, value): node_id}
        """
        values = [s.value for s in specs]
        h_level = analysis.hawkins.level

        existing_rows = (
            self._db.table("value_nodes")
            .select(
                "id, maslow_category, maslow_value, "
                "mention_count, confidence_sum, "
                "hawkins_level_sum, hawkins_entry_count"
            )
            .eq("user_id", user_id)
            .in_("maslow_value", values)
            .execute()
        ).data or []

        existing: dict[tuple[str, str], dict] = {
            (r["maslow_category"], r["maslow_value"]): r
            for r in existing_rows
        }

        node_map: dict[tuple[str, str], str] = {}

        for spec in specs:
            key = (spec.category, spec.value)
            if key in existing:
                node_id = self._increment_node(existing[key], spec.confidence, h_level)
            else:
                node_id = self._create_node(user_id, spec, h_level)
                existing[key] = {
                    "id":                  node_id,
                    "maslow_category":     spec.category,
                    "maslow_value":        spec.value,
                    "mention_count":       1,
                    "confidence_sum":      spec.confidence,
                    "hawkins_level_sum":   h_level,
                    "hawkins_entry_count": 1,
                }
            node_map[key] = node_id

        return node_map

    def _increment_node(
        self, node: dict, confidence: float, h_level: float
    ) -> str:
        new_count   = node["mention_count"] + 1
        new_conf    = node["confidence_sum"] + confidence
        new_weight  = round(new_conf / new_count, 4)

        # Hawkins хуримтлал — per-node energy avg-д ашиглана
        new_h_sum   = (node.get("hawkins_level_sum") or 0.0) + h_level
        new_h_count = (node.get("hawkins_entry_count") or 0) + 1
        new_h_avg   = round(new_h_sum / new_h_count, 3)

        self._db.table("value_nodes").update({
            "mention_count":       new_count,
            "confidence_sum":      round(new_conf, 4),
            "weight":              new_weight,
            "hawkins_level_sum":   round(new_h_sum, 3),
            "hawkins_entry_count": new_h_count,
            "hawkins_level_avg":   new_h_avg,
        }).eq("id", node["id"]).execute()

        return node["id"]

    def _create_node(self, user_id: str, spec: _NodeSpec, h_level: float) -> str:
        result = (
            self._db.table("value_nodes")
            .insert({
                "user_id":             user_id,
                "maslow_category":     spec.category,
                "maslow_value":        spec.value,
                "mention_count":       1,
                "confidence_sum":      round(spec.confidence, 4),
                "weight":              round(spec.confidence, 4),
                "hawkins_level_sum":   round(h_level, 3),
                "hawkins_entry_count": 1,
                "hawkins_level_avg":   round(h_level, 3),
            })
            .execute()
        )
        return result.data[0]["id"]

    # ── Private: Emotion (batch) ──────────────────────────────────────────────

    def _batch_upsert_emotions(
        self,
        node_map: dict[tuple[str, str], str],
        specs: list[_NodeSpec],
        entry_id: str,
        analysis: LlmAnalysisResult,
    ) -> list[str]:
        """
        1. Batch upsert emotions (нэг SELECT + нэг INSERT)
        2. Batch insert emotions_tracker (нэг INSERT)
        3. conflict_count RPC — зөвхөн шаардлагатай үед

        Returns:
            Шинэчлэх emotion_id-уудын жагсаалт
            (batch_update_dominant_emotions-д дамжуулна)
        """
        if not specs:
            return []

        max_conf    = specs[0].confidence
        p           = analysis.plutchik
        is_conflict = getattr(p, "conflict_flag", False)

        node_ids = [node_map[(s.category, s.value)] for s in specs
                    if (s.category, s.value) in node_map]

        # 1. Одоо байгаа emotion-уудыг нэг SELECT-ээр тат
        existing_emotions: dict[str, str] = {}  # node_id → emotion_id
        if node_ids:
            rows = (
                self._db.table("emotions")
                .select("id, value_node_id")
                .in_("value_node_id", node_ids)
                .execute()
            ).data or []
            existing_emotions = {r["value_node_id"]: r["id"] for r in rows}

        # 2. Дутуу байгааг batch insert
        missing_node_ids = [nid for nid in node_ids if nid not in existing_emotions]
        if missing_node_ids:
            inserted = (
                self._db.table("emotions")
                .insert([
                    {"value_node_id": nid, "total_entries": 0}
                    for nid in missing_node_ids
                ])
                .select("id, value_node_id")
                .execute()
            ).data or []
            for r in inserted:
                existing_emotions[r["value_node_id"]] = r["id"]

        # 3. Tracker rows бэлтгэж нэг batch INSERT
        tracker_rows: list[dict] = []
        conflict_node_ids: list[str] = []

        for rank, spec in enumerate(specs):
            key     = (spec.category, spec.value)
            node_id = node_map.get(key)
            if not node_id:
                continue

            emotion_id = existing_emotions.get(node_id)
            if not emotion_id:
                continue

            ratio        = spec.confidence / max_conf if max_conf > 0 else 1.0
            scaled_score = round(p.primary_score * ratio, 4)

            tracker_rows.append({
                "emotion_id":       emotion_id,
                "entry_id":         entry_id,
                "plutchik_primary": p.primary,
                "primary_score":    scaled_score,
                "plutchik_dyad":    p.dyad       if rank == 0 else None,
                "dyad_score":       p.dyad_score if rank == 0 else None,
                "is_conflict":      is_conflict,
            })

            if is_conflict:
                conflict_node_ids.append(node_id)

        if tracker_rows:
            self._db.table("emotions_tracker").insert(tracker_rows).execute()

        # 4. Conflict RPC — зөвхөн conflict байвал
        for nid in conflict_node_ids:
            self._db.rpc("increment_conflict_count", {"p_node_id": nid}).execute()

        return list(existing_emotions.values())

    def _batch_update_dominant_emotions(self, emotion_ids: list[str]) -> None:
        """
        v2: loop дотроос гаргаж, tracker insert дууссаны дараа нэг удаа дуудна.
        Emotion бүрийн dominant-г exponential decay-ээр тооцоолж шинэчилнэ.
        """
        for emotion_id in emotion_ids:
            self._update_dominant_emotion(emotion_id)

    def _update_dominant_emotion(self, emotion_id: str) -> None:
        """
        Сүүлийн _WINDOW_DAYS хоногийн tracker мэдээллээр
        exponential decay-weighted dominant тооцоолж emotions шинэчилнэ.

        decay = exp(-days_ago * ln(2) / half_life)
        → 30 хоногийн өмнөх утгын жин 0.5 болно
        """
        cutoff = (
            datetime.now(timezone.utc) - timedelta(days=_WINDOW_DAYS)
        ).isoformat()

        rows = (
            self._db.table("emotions_tracker")
            .select(
                "plutchik_primary, primary_score, "
                "plutchik_dyad, dyad_score, created_at"
            )
            .eq("emotion_id", emotion_id)
            .gte("created_at", cutoff)
            .order("created_at", desc=True)
            .limit(_TRACKER_LIMIT)
            .execute()
        ).data or []

        if not rows:
            return

        now = datetime.now(timezone.utc)
        ln2 = math.log(2)

        primary_totals: dict[str, float] = {}
        dyad_totals:    dict[str, float] = {}
        total_weight = 0.0

        for r in rows:
            created  = datetime.fromisoformat(r["created_at"])
            days_ago = (now - created).total_seconds() / 86400
            decay    = math.exp(-days_ago * ln2 / _HALF_LIFE_DAYS)

            key = r["plutchik_primary"]
            primary_totals[key] = (
                primary_totals.get(key, 0) + r["primary_score"] * decay
            )
            total_weight += decay

            if r.get("plutchik_dyad") and r.get("dyad_score"):
                dk = r["plutchik_dyad"]
                dyad_totals[dk] = (
                    dyad_totals.get(dk, 0) + r["dyad_score"] * decay
                )

        if not primary_totals or total_weight == 0:
            return

        dominant_primary = max(primary_totals, key=primary_totals.__getitem__)
        dominant_primary_score = round(
            primary_totals[dominant_primary] / total_weight, 3
        )
        dominant_dyad = (
            max(dyad_totals, key=dyad_totals.__getitem__) if dyad_totals else None
        )
        dominant_dyad_score = (
            round(dyad_totals[dominant_dyad] / total_weight, 3)
            if dominant_dyad else None
        )

        self._db.table("emotions").update({
            "dominant_primary":       dominant_primary,
            "dominant_primary_score": dominant_primary_score,
            "dominant_dyad":          dominant_dyad,
            "dominant_dyad_score":    dominant_dyad_score,
            "total_entries":          len(rows),
        }).eq("id", emotion_id).execute()

    # ── Private: Edge (batch) ─────────────────────────────────────────────────

    def _canonical_pair(self, id_1: str, id_2: str) -> tuple[str, str]:
        return (id_1, id_2) if id_1 < id_2 else (id_2, id_1)

    def _batch_upsert_edges(
        self,
        pairs: list[tuple[str, str]],
        entry_id: str,
        analysis: LlmAnalysisResult,
    ) -> None:
        """
        v2: pair бүрт нэг SELECT → нэг batch SELECT болгов.

        1. Canonical pair бүхэлд нь нэг SELECT
        2. Байгааг нь EWMA update, байхгүйг нь insert
        3. Tracker-т raw log нэмнэ (batch insert)
        """
        if not pairs:
            return

        h_level = analysis.hawkins.level
        h_score = analysis.hawkins.score

        canonical_pairs = [self._canonical_pair(a, b) for a, b in pairs]

        # 1. Нэг SELECT-ээр бүх existing edge-уудыг тат
        node_a_ids = [p[0] for p in canonical_pairs]
        node_b_ids = [p[1] for p in canonical_pairs]

        all_node_ids = list(set(node_a_ids + node_b_ids))
        existing_rows = (
            self._db.table("value_edges")
            .select("id, node_a_id, node_b_id, hawkins_level_avg, "
                    "hawkins_score_avg, interaction_count")
            .in_("node_a_id", all_node_ids)
            .in_("node_b_id", all_node_ids)
            .execute()
        ).data or []

        existing_edges: dict[tuple[str, str], dict] = {
            (r["node_a_id"], r["node_b_id"]): r
            for r in existing_rows
        }

        tracker_rows: list[dict] = []

        for node_a, node_b in canonical_pairs:
            key = (node_a, node_b)

            if key in existing_edges:
                e = existing_edges[key]
                new_level = round(
                    _EWMA_ALPHA * h_level + (1 - _EWMA_ALPHA) * e["hawkins_level_avg"], 3
                )
                new_score = round(
                    _EWMA_ALPHA * h_score + (1 - _EWMA_ALPHA) * e["hawkins_score_avg"], 4
                )
                self._db.table("value_edges").update({
                    "hawkins_level_avg": new_level,
                    "hawkins_score_avg": new_score,
                    "interaction_count": e["interaction_count"] + 1,
                }).eq("id", e["id"]).execute()
                edge_id = e["id"]

            else:
                init_level = round(
                    _EWMA_ALPHA * h_level + (1 - _EWMA_ALPHA) * _HAWKINS_PRIOR, 3
                )
                init_score = round(
                    _EWMA_ALPHA * h_score + (1 - _EWMA_ALPHA) * _HAWKINS_PRIOR_SCR, 4
                )
                result = (
                    self._db.table("value_edges")
                    .insert({
                        "node_a_id":         node_a,
                        "node_b_id":         node_b,
                        "hawkins_level_avg": init_level,
                        "hawkins_score_avg": init_score,
                        "interaction_count": 1,
                    })
                    .execute()
                )
                edge_id = result.data[0]["id"]
                # Дараагийн pair-д давхардал үүсэхгүйн тулд cache-д нэмнэ
                existing_edges[key] = {
                    "id":                edge_id,
                    "node_a_id":         node_a,
                    "node_b_id":         node_b,
                    "hawkins_level_avg": init_level,
                    "hawkins_score_avg": init_score,
                    "interaction_count": 1,
                }

            tracker_rows.append({
                "edge_id":       edge_id,
                "entry_id":      entry_id,
                "hawkins_level": h_level,
                "hawkins_score": h_score,
            })

        # 2. Tracker-т нэг batch INSERT
        if tracker_rows:
            self._db.table("value_edges_tracker").insert(tracker_rows).execute()


# ── Module-level helper ───────────────────────────────────────────────────────

def _rows_to_graph(rows: list[dict]) -> dict:
    """
    v_user_graph view row-уудыг React Flow-д тохирох
    {nodes, edges} бүтэц рүү хөрвүүлнэ.

    v2: hawkins_level_avg node-д нэмэгдсэн.
    """
    nodes: dict[str, dict] = {}
    edges: dict[str, dict] = {}

    for row in rows:
        nid = row["node_id"]
        if nid not in nodes:
            nodes[nid] = {
                "id":                nid,
                "maslow_category":   row["maslow_category"],
                "maslow_value":      row["maslow_value"],
                "weight":            row["weight"],
                "mention_count":     row["mention_count"],
                "hawkins_level_avg": row.get("hawkins_level_avg"),
                "dominant_primary":  row["dominant_primary"],
                "dominant_dyad":     row["dominant_dyad"],
            }

        eid = row.get("edge_id")
        if eid and eid not in edges:
            edges[eid] = {
                "id":                eid,
                "node_a_id":         row["node_a_id"],
                "node_b_id":         row["node_b_id"],
                "hawkins_level_avg": row["hawkins_level_avg"],
                "hawkins_score_avg": row["hawkins_score_avg"],
                "interaction_count": row["interaction_count"],
            }

    return {"nodes": list(nodes.values()), "edges": list(edges.values())}