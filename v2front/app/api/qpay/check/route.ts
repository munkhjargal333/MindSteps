import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const QPAY_SANDBOX_URL  = 'https://merchant-sandbox.qpay.mn/v2'
const QPAY_USERNAME     = process.env.QPAY_USERNAME  ?? 'TEST_VENDOR_MERCHANT'
const QPAY_PASSWORD     = process.env.QPAY_PASSWORD  ?? '123456'

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(`${QPAY_USERNAME}:${QPAY_PASSWORD}`).toString('base64')
  const res = await fetch(`${QPAY_SANDBOX_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${credentials}` },
  })
  if (!res.ok) throw new Error('QPay auth failed')
  const data = await res.json()
  return data.access_token
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { invoice_id, plan } = await req.json()

    const token = await getAccessToken()

    // Төлбөр шалгах
    const checkRes = await fetch(`${QPAY_SANDBOX_URL}/payment/check`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        object_type: 'INVOICE',
        object_id:   invoice_id,
        offset: { page_number: 1, page_limit: 10 },
      }),
    })

    if (!checkRes.ok) throw new Error('Payment check failed')

    const result = await checkRes.json()
    const isPaid = result.count > 0 &&
      result.rows?.some((r: any) => r.payment_status === 'PAID')

    // Төлсөн бол Supabase-д tier шинэчлэх
    if (isPaid) {
      await supabase
        .from('profiles')
        .update({ tier: plan, upgraded_at: new Date().toISOString() })
        .eq('id', user.id)
    }

    return NextResponse.json({ paid: isPaid, rows: result.rows })
  } catch (err: any) {
    console.error('QPay check error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}