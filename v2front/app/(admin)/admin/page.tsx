'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  adminListUsers,
  adminInviteUser,
  adminDeleteUser,
  adminGetLlmConfig,
  adminTestLlm,
  adminGetStats,
  type AdminUser,
  type LlmConfig,
  type AdminStats,
} from '@/lib/api/journalBackend';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Users,
  Settings,
  BarChart2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  UserPlus,
  Cpu,
  RefreshCw,
  Zap,
} from 'lucide-react';

// ─── Tab types ────────────────────────────────────────────────

type Tab = 'stats' | 'users' | 'llm';

// ─── Stats tab ────────────────────────────────────────────────

function StatsTab({ token }: { token: string }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setStats(await adminGetStats(token));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Алдаа');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin w-6 h-6 text-muted-foreground" /></div>;
  if (error) return <ErrorBlock message={error} />;

  const entries = [
    ['Нийт хэрэглэгч', stats?.total_users],
    ['Нийт бичлэг',    stats?.total_entries],
    ...Object.entries(stats ?? {})
      .filter(([k]) => !['total_users', 'total_entries'].includes(k))
      .slice(0, 6),
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {entries.map(([label, value]) => (
        <div key={String(label)} className="p-4 rounded-2xl border bg-card space-y-1">
          <p className="text-xs text-muted-foreground capitalize">{String(label).replace(/_/g, ' ')}</p>
          <p className="text-2xl font-bold">{value != null ? String(value) : '—'}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Users tab ────────────────────────────────────────────────

function UsersTab({ token }: { token: string }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteMsg, setInviteMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminListUsers(token);
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Алдаа');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteMsg(null);
    try {
      await adminInviteUser(token, inviteEmail.trim());
      setInviteMsg({ ok: true, text: 'Урилга амжилттай илгээлээ' });
      setInviteEmail('');
    } catch (e) {
      setInviteMsg({ ok: false, text: e instanceof Error ? e.message : 'Алдаа гарлаа' });
    } finally {
      setInviting(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Хэрэглэгчийг устгах уу? Энэ үйлдлийг буцааж болохгүй.')) return;
    setDeletingId(userId);
    try {
      await adminDeleteUser(token, userId);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Устгаж чадсангүй');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Invite */}
      <div className="p-5 rounded-2xl border bg-card space-y-3">
        <h3 className="font-semibold text-sm">Урилга илгээх</h3>
        <div className="flex gap-2">
          <Input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="И-мэйл хаяг"
            type="email"
            className="rounded-xl bg-muted/40 border-0 focus-visible:ring-1"
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
          />
          <Button
            onClick={handleInvite}
            disabled={inviting || !inviteEmail.trim()}
            className="rounded-xl gap-2 shrink-0"
            size="sm"
          >
            {inviting ? <Loader2 size={13} className="animate-spin" /> : <UserPlus size={13} />}
            Илгээх
          </Button>
        </div>
        {inviteMsg && (
          <p className={cn('text-xs', inviteMsg.ok ? 'text-emerald-600' : 'text-destructive')}>
            {inviteMsg.text}
          </p>
        )}
      </div>

      {/* Users list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Хэрэглэгчид ({users.length})</h3>
          <Button variant="ghost" size="sm" onClick={load} disabled={loading} className="rounded-xl gap-1.5 text-xs">
            {loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
            Шинэчлэх
          </Button>
        </div>

        {error && <ErrorBlock message={error} />}

        {!loading && users.length === 0 && !error && (
          <p className="text-sm text-muted-foreground text-center py-8">Хэрэглэгч байхгүй</p>
        )}

        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3 p-4 rounded-2xl border bg-card">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
              {(String(user.email ?? '?')[0] ?? '?').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.email ?? user.id}</p>
              <p className="text-xs text-muted-foreground">
                {user.created_at ? new Date(user.created_at).toLocaleDateString('mn-MN') : '—'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => handleDelete(user.id)}
              disabled={deletingId === user.id}
            >
              {deletingId === user.id ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Trash2 size={13} />
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LLM Config tab ───────────────────────────────────────────

function LlmTab({ token }: { token: string }) {
  const [config, setConfig] = useState<LlmConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message?: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    adminGetLlmConfig(token)
      .then(setConfig)
      .catch((e) => setError(e instanceof Error ? e.message : 'Алдаа'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await adminTestLlm(token);
      setTestResult(res);
    } catch (e) {
      setTestResult({ ok: false, message: e instanceof Error ? e.message : 'Алдаа' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin w-6 h-6 text-muted-foreground" /></div>;
  if (error) return <ErrorBlock message={error} />;

  return (
    <div className="space-y-5">
      {/* Config display */}
      <div className="p-5 rounded-2xl border bg-card space-y-3">
        <h3 className="font-semibold text-sm">Одоогийн тохиргоо</h3>
        {config ? (
          <div className="space-y-2">
            {Object.entries(config).map(([key, val]) => (
              <div key={key} className="flex items-start justify-between gap-4 py-2 border-b last:border-0">
                <span className="text-xs text-muted-foreground capitalize min-w-0">{key.replace(/_/g, ' ')}</span>
                <span className="text-xs font-mono text-foreground/80 text-right break-all max-w-[60%]">
                  {typeof val === 'object' ? JSON.stringify(val) : String(val ?? '—')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Тохиргоо байхгүй</p>
        )}
      </div>

      {/* Test button */}
      <div className="p-5 rounded-2xl border bg-card space-y-3">
        <h3 className="font-semibold text-sm">Холболт шалгах</h3>
        <Button
          onClick={handleTest}
          disabled={testing}
          variant="outline"
          className="rounded-xl gap-2"
        >
          {testing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
          Шалгах
        </Button>
        {testResult && (
          <div className={cn(
            'flex items-center gap-2 p-3 rounded-xl text-sm',
            testResult.ok ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                          : 'bg-destructive/10 text-destructive'
          )}>
            {testResult.ok
              ? <CheckCircle2 size={15} />
              : <AlertCircle size={15} />}
            {testResult.message ?? (testResult.ok ? 'Холболт амжилттай' : 'Холболт амжилтгүй')}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Error helper ─────────────────────────────────────────────

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm">
      <AlertCircle size={16} />
      {message}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default function AdminPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('stats');

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'stats', label: 'Статистик', icon: BarChart2 },
    { id: 'users', label: 'Хэрэглэгчид', icon: Users },
    { id: 'llm',   label: 'LLM',        icon: Cpu },
  ];

  if (!token) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Нэвтрэх шаардлагатай</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Админ панель</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Систем удирдлага
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted/60 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'stats' && <StatsTab token={token} />}
        {activeTab === 'users' && <UsersTab token={token} />}
        {activeTab === 'llm'   && <LlmTab   token={token} />}
      </div>
    </DashboardLayout>
  );
}
