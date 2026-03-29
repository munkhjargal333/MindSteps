'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useThoughtContext } from '@/contexts/context'
import { cn } from '@/lib/utils'
import { Check, X, ArrowLeft, Loader2, QrCode, RefreshCw, ShieldCheck } from 'lucide-react'

const PLANS = [
  {
    id: 'demo',
    label: 'Demo',
    price: 'Үнэгүй',
    sub: 'Туршиж үзэх',
    color: 'text-muted-foreground',
    badge: '',
    description: '2 минутын дотор өөрийгөө ойлгож үзэх',
    highlight: '',
    features: [
      { text: '3 хүртэлх тэмдэглэл',  ok: true  },
      { text: 'Тэмдэглэлийн шинжилгээ', ok: true  },
      { text: 'Gemini ai 2.5',       ok: true },
      { text: 'Түүх хадгалах',       ok: false },
      { text: 'Давтамж илрүүлэх',       ok: false },
      { text: 'Паттерн шинжилгээ',         ok: false },
    ],
  },
  {
    id: 'free',
    label: 'Free',
    price: 'Үнэгүй',
    sub: 'Өдөр тутам',
    color: 'text-orange-500',
    badge: '',
    description: 'Өөрийгөө ажиглах зуршил үүсгэнэ',
    highlight: '',
    features: [
      { text: 'Өдөрт 3–5 тэмдэглэл', ok: true  },
      { text: 'Тэмдэглэлийн шинжилгээ', ok: true  },
      { text: 'Gemini AI 2.5',       ok: true },
      { text: 'Түүх хадгалах', ok: true  },
      { text: 'Давтамж илрүүлэх', ok: true },
      { text: 'Өсөлт tracking',   ok: false },
      { text: 'Паттерн шинжилгээ',         ok: false },
    ],
  },
  {
    id: 'pro',
    label: 'Pro',
    price: '9,900₮',
    sub: 'сард',
    color: 'text-violet-500',
    badge: 'Шилдэг',
    description: 'Өөрийгөө гүн ойлгож, дотоод өөрчлөлт эхлүүлнэ',
    highlight: 'Давтагддаг бодлуудаа олж харна',
    features: [
        { text: 'Хязгааргүй тэмдэглэл', ok: true  },
        { text: 'Тэмдэглэлийн шинжилгээ', ok: true  },
        { text: 'Gemini AI 3.0',       ok: true },
        { text: 'Давтамж илрүүлэх', ok: true },
        { text: 'Өсөлт tracking',   ok: true },
        { text: 'Паттерн шинжилгээ',         ok: true },
        { text: 'Зөвлөмж,зөвлөгөө',         ok: true },
    ],
  },
] as const

// ── QPay төлбөрийн state ─────────────────────────────────────
type PayState = 'idle' | 'loading' | 'qr' | 'checking' | 'success' | 'error'

export default function UpgradePage() {
  const router  = useRouter()
  const { tier } = useThoughtContext()

  const [payState,  setPayState]  = useState<PayState>('idle')
  const [invoiceId, setInvoiceId] = useState<string | null>(null)
  const [qrImage,   setQrImage]   = useState<string | null>(null)   // base64
  const [qrText,    setQrText]    = useState<string | null>(null)
  const [bankUrls,  setBankUrls]  = useState<any[]>([])
  const [error,     setError]     = useState<string | null>(null)

  // ── QPay invoice үүсгэх ──────────────────────────────────
  async function handleUpgrade() {
    setPayState('loading')
    setError(null)

    try {
      const res  = await fetch('/api/qpay/invoice', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ plan: 'pro' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Invoice үүсгэхэд алдаа гарлаа')

      setInvoiceId(data.invoice_id)
      setQrImage(data.qr_image)
      setQrText(data.qr_text)
      setBankUrls(data.urls ?? [])
      setPayState('qr')
    } catch (err: any) {
      setError(err.message)
      setPayState('error')
    }
  }

  // ── Төлбөр шалгах ────────────────────────────────────────
  async function handleCheckPayment() {
    if (!invoiceId) return
    setPayState('checking')

    try {
      const res  = await fetch('/api/qpay/check', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ invoice_id: invoiceId, plan: 'pro' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      if (data.paid) {
        setPayState('success')
        // 2 секундын дараа home руу шилжих
        setTimeout(() => router.push('/home'), 2000)
      } else {
        setPayState('qr') // Дахин QR харуулна
        setError('Төлбөр баталгаажаагүй байна. Та QPay аппаар шалгана уу.')
      }
    } catch (err: any) {
      setError(err.message)
      setPayState('qr')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ── Header ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-xl border bg-card hover:bg-muted transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Планаа сонгох</h1>
            <p className="text-xs text-muted-foreground">Одоогийн план: <span className="text-orange-500 font-semibold">{tier}</span></p>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {PLANS.map((plan) => {
            const isCurrent = tier === plan.id
            const isPro     = plan.id === 'pro'

            return (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-2xl border p-4 flex flex-col gap-3 transition-all',
                  isPro
                    ? 'border-violet-500/50 bg-violet-50/50 dark:bg-violet-950/20'
                    : 'bg-card',
                  isCurrent && 'ring-2 ring-orange-500'
                )}
              >
                {plan.badge ? (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="text-[10px] font-bold bg-violet-500 text-white px-2.5 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                ) : null}

                <div>
                  <p className={cn('text-sm font-bold', plan.color)}>{plan.label}</p>
                  <p className="text-lg font-black">{plan.price}</p>
                  <p className="text-[10px] text-muted-foreground">{plan.sub}</p>
                </div>

                <p className="text-[11px] text-muted-foreground leading-snug border-y py-2">
                  {plan.description}
                </p>

                {plan.highlight ? (
                  <p className="text-[11px] bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-lg px-2 py-1.5 font-medium">
                    {plan.highlight}
                  </p>
                ) : null}

                <ul className="space-y-1.5 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      {f.ok
                        ? <Check size={12} className="text-green-500 mt-0.5 shrink-0" />
                        : <X     size={12} className="text-muted-foreground/40 mt-0.5 shrink-0" />
                      }
                      <span className={cn(
                        'text-[11px] leading-tight',
                        f.ok ? 'text-foreground' : 'text-muted-foreground/50'
                      )}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="text-center text-[11px] font-semibold text-orange-500 py-1">
                    Одоогийн план
                  </div>
                ) : isPro ? (
                  <button
                    onClick={handleUpgrade}
                    disabled={payState === 'loading' || payState === 'qr' || payState === 'checking'}
                    className="w-full py-2 rounded-xl bg-violet-500 text-white text-xs font-bold hover:bg-violet-600 transition-colors disabled:opacity-50"
                  >
                    {payState === 'loading'
                      ? <Loader2 size={14} className="animate-spin mx-auto" />
                      : 'Pro болох'
                    }
                  </button>
                ) : null}
              </div>
            )
          })}
        </div>

        {/* ── QPay QR хэсэг ── */}
        {(payState === 'qr' || payState === 'checking' || payState === 'success') && (
          <div className="rounded-2xl border bg-card p-6 space-y-4 animate-in fade-in duration-300">

            {payState === 'success' ? (
              // Амжилттай
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <ShieldCheck size={32} className="text-green-500" />
                </div>
                <p className="font-bold text-lg">Амжилттай!</p>
                <p className="text-sm text-muted-foreground text-center">
                  Pro план идэвхжлээ. Нүүр хуудас руу шилжиж байна...
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <QrCode size={18} className="text-violet-500" />
                  <p className="font-semibold text-sm">QPay-р төлөх</p>
                  <span className="ml-auto text-xs text-muted-foreground">9,900₮</span>
                </div>

                {/* QR зураг */}
                {qrImage && (
                  <div className="flex justify-center">
                    <div className="p-3 bg-white rounded-2xl border">
                      <img
                        src={`data:image/png;base64,${qrImage}`}
                        alt="QPay QR"
                        className="w-44 h-44 object-contain"
                      />
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-center text-muted-foreground">
                  QPay аппаа нээж QR кодыг скан хийн төлнө үү
                </p>

                {/* Алдаа */}
                {error && (
                  <p className="text-xs text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl py-2 px-3">
                    {error}
                  </p>
                )}

                {/* Банкны deep link-үүд */}
                {bankUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {bankUrls.slice(0, 6).map((url: any, i: number) => (
                      <a
                        key={i}
                        href={url.link}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl border hover:bg-muted transition-colors text-center"
                      >
                        {url.logo && (
                          <img src={url.logo} alt={url.name} className="w-8 h-8 rounded-lg object-contain" />
                        )}
                        <span className="text-[10px] text-muted-foreground leading-tight">{url.name}</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* Шалгах товч */}
                <button
                  onClick={handleCheckPayment}
                  disabled={payState === 'checking'}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-500 text-white text-sm font-semibold hover:bg-violet-600 transition-colors disabled:opacity-60"
                >
                  {payState === 'checking' ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                  {payState === 'checking' ? 'Шалгаж байна...' : 'Төлбөр шалгах'}
                </button>
              </>
            )}
          </div>
        )}

        {/* Error state */}
        {payState === 'error' && (
          <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-4 text-center space-y-2">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => { setPayState('idle'); setError(null) }}
              className="text-xs text-muted-foreground underline"
            >
              Дахин оролдох
            </button>
          </div>
        )}

        {/* ── Footer note ── */}
        <p className="text-[10px] text-center text-muted-foreground/40 mt-8">
          QPay sandbox горимд ажиллаж байна • Жинхэнэ төлбөр авахгүй
        </p>
      </div>
    </div>
  )
}