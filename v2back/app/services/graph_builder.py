"""
GraphBuilder — ValueGraph CRUD үйлдлүүд.
JournalService-с тусгаарласан (SRP).
"""

from supabase import Client
from app.schemas.analysis import LlmAnalysisResult


class GraphBuilder:
    """ValueNode болон Emotion tracker шинэчлэлт."""

    def __init__(self, db: Client) -> None:
        self._db = db

    def update_nodes(
        self,
        user_id: str,
        analysis: LlmAnalysisResult,
        entry_id: str,
    ) -> None:
        """Маслоугийн шинжилгээнд тулгуурлан node-уудыг upsert хийнэ."""
        for item in analysis.maslow:
            category = item.get("category")
            for value_dict in item.get("values", []):
                for value, confidence in value_dict.items():
                    node_id = self._upsert_node(
                        user_id, category, value, confidence
                    )
                    self._upsert_emotion(node_id, entry_id, analysis)

    def fetch_graph(self, user_id: str) -> dict:
        """v_user_graph view-г ашиглан React Flow граф буцаана."""
        rows = (
            self._db.table("v_user_graph")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        ).data or []
        return _rows_to_graph(rows)

    def build_summary(self, user_id: str) -> dict:
        """Deep Insight үүсгэхэд шаардлагатай дүн шинжилгээ."""
        top_nodes = (
            self._db.table("value_nodes")
            .select("maslow_category, maslow_value, weight, mention_count")
            .eq("user_id", user_id)
            .order("weight", desc=True)
            .limit(5)
            .execute()
        ).data

        dominant_row = (
            self._db.table("emotions")
            .select("dominant_primary, value_nodes!inner(user_id)")
            .eq("value_nodes.user_id", user_id)
            .order("total_entries", desc=True)
            .limit(1)
            .execute()
        ).data

        return {
            "top_nodes": top_nodes,
            "dominant_emotion": (
                dominant_row[0].get("dominant_primary")
                if dominant_row else None
            ),
        }

    # ── Private ──────────────────────────────────────────────────────────────

    def _upsert_node(
        self,
        user_id: str,
        category: str,
        value: str,
        confidence: float,
    ) -> str:
        existing = (
            self._db.table("value_nodes")
            .select("id, mention_count, confidence_sum")
            .eq("user_id", user_id)
            .eq("maslow_category", category)
            .eq("maslow_value", value)
            .execute()
        ).data

        if existing:
            return self._increment_node(existing[0], confidence)
        return self._create_node(user_id, category, value, confidence)

    def _increment_node(self, node: dict, confidence: float) -> str:
        new_conf = node["confidence_sum"] + confidence
        self._db.table("value_nodes").update(
            {
                "mention_count": node["mention_count"] + 1,
                "confidence_sum": new_conf,
                "weight": new_conf,
            }
        ).eq("id", node["id"]).execute()
        return node["id"]

    def _create_node(
        self,
        user_id: str,
        category: str,
        value: str,
        confidence: float,
    ) -> str:
        result = (
            self._db.table("value_nodes")
            .insert(
                {
                    "user_id": user_id,
                    "maslow_category": category,
                    "maslow_value": value,
                    "mention_count": 1,
                    "confidence_sum": confidence,
                    "weight": confidence,
                }
            )
            .execute()
        )
        return result.data[0]["id"]

    def _upsert_emotion(
        self,
        node_id: str,
        entry_id: str,
        analysis: LlmAnalysisResult,
    ) -> None:
        p = analysis.plutchik
        tracker = {
            "plutchik_primary": p.primary,
            "primary_score": p.primary_score,
            "plutchik_dyad": p.dyad,
            "dyad_score": p.dyad_score,
        }
        dominant = {
            **tracker,
            "dominant_primary": p.primary,
            "dominant_primary_score": p.primary_score,
            "dominant_dyad": p.dyad,
            "dominant_dyad_score": p.dyad_score,
        }

        existing = (
            self._db.table("emotions")
            .select("id, total_entries")
            .eq("value_node_id", node_id)
            .execute()
        ).data

        if existing:
            emotion_id = existing[0]["id"]
            self._db.table("emotions").update(
                {**dominant, "total_entries": existing[0]["total_entries"] + 1}
            ).eq("id", emotion_id).execute()
        else:
            emotion_id = (
                self._db.table("emotions")
                .insert({"value_node_id": node_id, **dominant, "total_entries": 1})
                .execute()
            ).data[0]["id"]

        self._db.table("emotions_tracker").insert(
            {"emotion_id": emotion_id, "entry_id": entry_id, **tracker}
        ).execute()


# ── Module-level helper ───────────────────────────────────────────────────────

def _rows_to_graph(rows: list[dict]) -> dict:
    nodes: dict[str, dict] = {}
    edges: dict[str, dict] = {}

    for row in rows:
        nid = row["node_id"]
        if nid not in nodes:
            nodes[nid] = {
                "id": nid,
                "maslow_category": row["maslow_category"],
                "maslow_value": row["maslow_value"],
                "weight": row["weight"],
                "mention_count": row["mention_count"],
                "dominant_primary": row["dominant_primary"],
                "dominant_dyad": row["dominant_dyad"],
            }
        if row.get("edge_id") and row["edge_id"] not in edges:
            edges[row["edge_id"]] = {
                "id": row["edge_id"],
                "from_node_id": nid,
                "to_node_id": row["to_node_id"],
                "hawkins_level_avg": row["hawkins_level_avg"],
                "hawkins_score_avg": row["hawkins_score_avg"],
                "interaction_count": row["interaction_count"],
            }

    return {"nodes": list(nodes.values()), "edges": list(edges.values())}
