'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getValueGraph, type GraphData } from '@/lib/api/journalBackend';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Network, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

// ─── Simple SVG force-like graph renderer ─────────────────────
// (Replaces react-flow dependency — layout is computed client-side)

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface Edge {
  source: string;
  target: string;
}

const NODE_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f97316',
  '#14b8a6', '#3b82f6', '#a3e635', '#f43f5e',
];

function layoutGraph(raw: GraphData): { nodes: Node[]; edges: Edge[] } {
  const rawNodes = Array.isArray(raw.nodes) ? raw.nodes : [];
  const rawEdges = Array.isArray(raw.edges) ? raw.edges : [];

  const W = 600;
  const H = 420;
  const cx = W / 2;
  const cy = H / 2;
  const r = Math.min(cx, cy) - 60;

  const nodes: Node[] = rawNodes.map((n, i) => {
    const angle = (2 * Math.PI * i) / rawNodes.length - Math.PI / 2;
    return {
      id: String(n.id),
      label: String(n.label ?? n.id),
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      size: 28,
      color: NODE_COLORS[i % NODE_COLORS.length],
    };
  });

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const edges: Edge[] = rawEdges
    .filter((e) => nodeMap[String(e.source)] && nodeMap[String(e.target)])
    .map((e) => ({ source: String(e.source), target: String(e.target) }));

  return { nodes, edges };
}

// ─── Graph SVG component ──────────────────────────────────────

function GraphView({ data }: { data: GraphData }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const { nodes, edges } = layoutGraph(data);

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 gap-4 text-center">
        <Network size={32} className="text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">Граф өгөгдөл байхгүй байна</p>
      </div>
    );
  }

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <svg
        viewBox="0 0 600 420"
        className="w-full"
        style={{ maxHeight: 420 }}
      >
        {/* Edges */}
        <g>
          {edges.map((e, i) => {
            const src = nodeMap[e.source];
            const tgt = nodeMap[e.target];
            if (!src || !tgt) return null;
            const isHighlighted =
              hovered === e.source || hovered === e.target;
            return (
              <line
                key={i}
                x1={src.x}
                y1={src.y}
                x2={tgt.x}
                y2={tgt.y}
                stroke={isHighlighted ? '#6366f1' : 'currentColor'}
                strokeWidth={isHighlighted ? 2 : 1}
                strokeOpacity={isHighlighted ? 0.7 : 0.15}
                className="transition-all"
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map((node) => {
            const isHov = hovered === node.id;
            const connectedEdges = edges.filter(
              (e) => e.source === node.id || e.target === node.id
            );
            const isConnected =
              hovered != null &&
              connectedEdges.some(
                (e) => e.source === hovered || e.target === hovered
              );

            return (
              <g
                key={node.id}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
                style={{ transition: 'opacity 0.2s' }}
                opacity={hovered && !isHov && !isConnected ? 0.3 : 1}
              >
                {/* Glow */}
                {isHov && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size + 8}
                    fill={node.color}
                    opacity={0.15}
                  />
                )}
                {/* Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size}
                  fill={node.color}
                  opacity={isHov ? 1 : 0.85}
                />
                {/* Label */}
                <text
                  x={node.x}
                  y={node.y + node.size + 14}
                  textAnchor="middle"
                  fontSize={10}
                  fill="currentColor"
                  fillOpacity={0.7}
                  fontWeight={isHov ? 700 : 400}
                >
                  {node.label.length > 14 ? node.label.slice(0, 12) + '…' : node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Legend */}
      <div className="px-5 py-4 border-t flex flex-wrap gap-2">
        {nodes.map((node) => (
          <span
            key={node.id}
            onMouseEnter={() => setHovered(node.id)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] cursor-pointer transition-all',
              hovered === node.id
                ? 'bg-foreground/10 font-medium'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: node.color }}
            />
            {node.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default function GraphPage() {
  const { token } = useAuth();
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getValueGraph(token);
      setGraphData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Үнэт зүйлсийн граф</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Таны дотоод үнэт зүйлсийн харилцан холбоос
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-2"
            onClick={load}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <RefreshCw size={13} />
            )}
            Шинэчлэх
          </Button>
        </div>

        {/* Content */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {!loading && !error && !graphData && (
          <div className="flex flex-col items-center py-20 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              <Network size={24} className="text-muted-foreground/40" />
            </div>
            <p className="font-medium text-foreground/70">Граф байхгүй</p>
          </div>
        )}

        {!loading && graphData && <GraphView data={graphData} />}
      </div>
    </DashboardLayout>
  );
}
