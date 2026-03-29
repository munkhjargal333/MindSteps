import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const QPAY_SANDBOX_URL = 'https://merchant-sandbox.qpay.mn/v2'
const QPAY_USERNAME    = process.env.QPAY_USERNAME ?? 'TEST_VENDOR_MERCHANT'
const QPAY_PASSWORD    = process.env.QPAY_PASSWORD ?? '123456'
const QPAY_INVOICE_CODE = process.env.QPAY_INVOICE_CODE ?? 'TEST_INVOICE'

// QPay access token авах
async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(`${QPAY_USERNAME}:${QPAY_PASSWORD}`).toString('base64')

  const res = await fetch(`${QPAY_SANDBOX_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) throw new Error('QPay auth failed')

  const data = await res.json()
  return data.access_token
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await req.json() // 'free' | 'pro'

    const amount = plan === 'pro' ? 9900 : 0 // MNT

    const token = await getAccessToken()

    // Invoice үүсгэх
    const invoiceRes = await fetch(`${QPAY_SANDBOX_URL}/invoice`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoice_code:        QPAY_INVOICE_CODE,
        sender_invoice_no:   `${user.id}-${Date.now()}`,
        invoice_receiver_code: 'terminal',
        invoice_description: `MindSteps ${plan} план`,
        amount,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/qpay/callback?user_id=${user.id}&plan=${plan}`,
      }),
    })

    if (!invoiceRes.ok) {
      const err = await invoiceRes.text()
      throw new Error(`Invoice creation failed: ${err}`)
    }

    const invoice = await invoiceRes.json()

    return NextResponse.json({
      invoice_id:  invoice.invoice_id,
      qr_text:     invoice.qr_text,
      qr_image:    invoice.qr_image,   // base64 PNG
      urls:        invoice.urls,        // банкны deep link-үүд
      amount,
    })
  } catch (err: any) {
    console.error('QPay invoice error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}