'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEmotionStats } from '@/lib/hooks/useEmotionStats';
import { cn } from '@/lib/utils';
import { BarChart2, Loader2, AlertCircle } from 'lucide-react';

// ── Тохиргоо ──────────────────────────────────────────────────────────────────

const ENTRY_OPTIONS = [
  { label: '1',  value: 1  },
  { label: '5',  value: 5  },
  { label: '10', value: 10 },
  { label: '20', value: 20 },
] as const;

type EntryCount = (typeof ENTRY_OPTIONS)[number]['value'];

// 8 Plutchik emotion — wheel-н дарааллаар (цагийн зүүний дагуу)
const EMOTIONS = [
  { key: 'joy',          label: 'Баяр',     color: '#facc15' },
  { key: 'trust',        label: 'Итгэл',    color: '#4ade80' },
  { key: 'fear',         label: 'Айдас',    color: '#a78bfa' },
  { key: 'surprise',     label: 'Гайхал',   color: '#fb923c' },
  { key: 'sadness',      label: 'Гуниг',    color: '#60a5fa' },
  { key: 'disgust',      label: 'Жигшил',   color: '#86efac' },
  { key: 'anger',        label: 'Уур',      color: '#f87171' },
  { key: 'anticipation', label: 'Хүлээлт',  color: '#fbbf24' },
] as const;

// ── Radar Chart ───────────────────────────────────────────────────────────────

interface StatItem {
  emotion:    string;
  score_sum:  number;
  count:      number;
  percentage: number;
}

function RadarChart({ stats }: { stats: StatItem[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const W  = 320;
  const H  = 320;
  const cx = W / 2;
  const cy = H / 2;
  const R  = 110; // max radius

  const N = EMOTIONS.length;

  // Score-г 0–1 хооронд нормчилно
  const maxScore = Math.max(...stats.map((s) => s.score_sum), 0.01);
  const scoreMap = Object.fromEntries(stats.map((s) => [s.emotion, s.score_sum]));

  // Тэнхлэгийн endpoint тооцоолол (дээрээс эхэлнэ)
  const axisAngle = (i: number) => (2 * Math.PI * i) / N - Math.PI / 2;
  const axisPoint = (i: number, r: number) => ({
    x: cx + r * Math.cos(axisAngle(i)),
    y: cy + r * Math.sin(axisAngle(i)),
  });

  // Polygon цэгүүд
  const polygonPoints = EMOTIONS.map((e, i) => {
    const score = scoreMap[e.key] ?? 0;
    const r = (score / maxScore) * R;
    return axisPoint(i, r);
  });

  const polygonPath =
    polygonPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';

  // Grid тойрог — 25%, 50%, 75%, 100%
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const gridPolygon = (ratio: number) =>
    EMOTIONS.map((_, i) => {
      const p = axisPoint(i, R * ratio);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ');

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        className="overflow-visible"
      >
        {/* Grid polygon-ууд */}
        {gridLevels.map((ratio) => (
          <polygon
            key={ratio}
            points={gridPolygon(ratio)}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.08}
            strokeWidth={1}
          />
        ))}

        {/* Тэнхлэгийн шугамууд */}
        {EMOTIONS.map((_, i) => {
          const end = axisPoint(i, R);
          return (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={end.x} y2={end.y}
              stroke="currentColor"
              strokeOpacity={0.1}
              strokeWidth={1}
            />
          );
        })}

        {/* Дүүргэсэн polygon */}
        <path
          d={polygonPath}
          fill="url(#radarGradient)"
          fillOpacity={0.35}
          stroke="url(#radarStroke)"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Gradient тодорхойлолт */}
        <defs>
          <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="radarStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#818cf8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>

        {/* Vertex цэгүүд + hover */}
        {EMOTIONS.map((e, i) => {
          const score = scoreMap[e.key] ?? 0;
          const r = (score / maxScore) * R;
          const p = axisPoint(i, r);
          const isHov = hovered === e.key;
          return (
            <circle
              key={e.key}
              cx={p.x} cy={p.y}
              r={isHov ? 6 : 4}
              fill={e.color}
              stroke="var(--background)"
              strokeWidth={2}
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHovered(e.key)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}

        {/* Label-ууд */}
        {EMOTIONS.map((e, i) => {
          const labelR = R + 26;
          const p = axisPoint(i, labelR);
          const angle = axisAngle(i) * (180 / Math.PI);
          const stat = stats.find((s) => s.emotion === e.key);
          const pct = stat ? `${stat.percentage.toFixed(0)}%` : '0%';
          const isHov = hovered === e.key;

          // Anchor тооцоолол — зүүн/баруун тал
          const anchor =
            Math.abs(Math.cos(axisAngle(i))) < 0.1
              ? 'middle'
              : Math.cos(axisAngle(i)) > 0
              ? 'start'
              : 'end';

          return (
            <g key={e.key}>
              <text
                x={p.x} y={p.y - 3}
                textAnchor={anchor}
                fontSize={11}
                fontWeight={isHov ? 700 : 500}
                fill={isHov ? e.color : 'currentColor'}
                fillOpacity={isHov ? 1 : 0.75}
                className="transition-all duration-150 select-none"
              >
                {e.label}
              </text>
              <text
                x={p.x} y={p.y + 11}
                textAnchor={anchor}
                fontSize={10}
                fill={e.color}
                fillOpacity={isHov ? 1 : 0.5}
                className="transition-all duration-150 select-none"
              >
                {pct}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      {hovered && (() => {
        const e    = EMOTIONS.find((em) => em.key === hovered)!;
        const stat = stats.find((s) => s.emotion === hovered);
        return (
          <div
            className="px-4 py-2 rounded-xl border bg-card text-sm flex items-center gap-3"
            style={{ borderColor: e.color + '40' }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }} />
            <span className="font-medium">{e.label}</span>
            <span className="text-muted-foreground">
              {stat ? `${stat.count} удаа · ${stat.percentage.toFixed(1)}%` : '0 удаа'}
            </span>
          </div>
        );
      })()}
    </div>
  );
}

// ── Bar жагсаалт ──────────────────────────────────────────────────────────────

function EmotionBars({ stats }: { stats: StatItem[] }) {
  const maxScore = Math.max(...stats.map((s) => s.score_sum), 0.01);

  return (
    <div className="space-y-2.5">
      {EMOTIONS.map((e) => {
        const stat = stats.find((s) => s.emotion === e.key);
        const score = stat?.score_sum ?? 0;
        const pct   = Math.round((score / maxScore) * 100);
        const count = stat?.count ?? 0;

        return (
          <div key={e.key} className="flex items-center gap-3">
            <div className="w-16 shrink-0 text-right">
              <span className="text-xs font-medium text-muted-foreground">{e.label}</span>
            </div>
            <div className="flex-1 h-5 bg-muted/40 rounded-lg overflow-hidden">
              <div
                className="h-full rounded-lg transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  backgroundColor: e.color,
                  opacity: count === 0 ? 0.2 : 0.85,
                }}
              />
            </div>
            <span className="w-8 shrink-0 text-xs font-bold text-right"
              style={{ color: count > 0 ? e.color : undefined }}>
              {count > 0 ? count : '—'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EmotionsPage() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<EntryCount>(10);
  const { stats, loading, error } = useEmotionStats(token, entries);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Сэтгэл хөдлөл</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Сэтгэлзүйн тархалт
          </p>
        </div>

        {/* Entry selector */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Сүүлийн тэмдэглэл
          </span>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60">
            {ENTRY_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setEntries(value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  entries === value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && stats.length === 0 && (
        <div className="flex flex-col items-center py-20 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <BarChart2 size={24} className="text-muted-foreground/40" />
          </div>
          <div>
            <p className="font-medium text-foreground/70">Мэдээлэл байхгүй</p>
            <p className="text-sm text-muted-foreground mt-1">
              Тэмдэглэл нэмснээр сэтгэл хөдлөлийн дүр зураг бий болно
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && stats.length > 0 && (
        <div className="space-y-6">
          {/* Radar */}
          <div className="rounded-2xl border bg-card p-6 flex justify-center">
            <RadarChart stats={stats} />
          </div>

          {/* Bar жагсаалт */}
          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <p className="text-sm font-medium text-muted-foreground">Дэлгэрэнгүй</p>
            <EmotionBars stats={stats} />
          </div>

          {/* Footer */}
          <p className="text-xs text-muted-foreground/50 text-center">
            Сүүлийн {entries} тэмдэглэл · Weighted score (confidence-ээр жинлэсэн)
          </p>
        </div>
      )}
    </div>
  );
}