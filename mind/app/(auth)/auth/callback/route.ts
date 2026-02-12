import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')
  const origin = requestUrl.origin

  console.log('[CALLBACK] Received:', { code: !!code, error, error_description })

  // 1. OAuth эсвэл Signup алдаа шалгах
  if (error) {
    console.error('[CALLBACK] Auth error:', { error, error_description })
    
    if (error === 'access_denied') {
      return NextResponse.redirect(`${origin}/join`)
    }
    if (error_description && error_description.includes('Database error saving new user')) {
      // Урьдчилан бүртгүүлээгүй хэрэглэгчийг unauthorized руу шилжүүлнэ
      return NextResponse.redirect(`${origin}/join`)
    }


    
    return NextResponse.redirect(
      `${origin}/login?error=${error}&message=${encodeURIComponent(error_description || 'Алдаа гарлаа')}`
    )
  }

  // 2. Code байхгүй бол буцаах
  if (!code) {
    return NextResponse.redirect(`${origin}/login`)
  }

  try {
    const supabase = await createClient()
    
    // 3. Code-ыг session болгох
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log('[CALLBACK] Exchange result:', { 
      hasSession: !!data?.session, 
      hasUser: !!data?.user,
      error: exchangeError?.message 
    })
    
    if (exchangeError) {
      console.error('[CALLBACK] Exchange error:', exchangeError.message)

      // Whitelist-д байхгүй хэрэглэгч
      const isUnauthorized = 
        exchangeError.message.includes('not authorized') ||
        exchangeError.message.includes('Signup Error') ||
        exchangeError.message.includes('User not allowed')

      if (isUnauthorized) {
        return NextResponse.redirect(`${origin}/join`)
      }

      // Бусад алдаа
      return NextResponse.redirect(
        `${origin}/login?error=auth_fail&message=${encodeURIComponent(exchangeError.message)}`
      )
    }

    // 4. Session үүссэн эсэхийг дахин шалгах
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('User verification failed:', userError)
      return NextResponse.redirect(`${origin}/join`)
    }

    // 5. Амжилттай бол quick руу
    return NextResponse.redirect(`${origin}/quick`)

  } catch (err) {
    console.error('Fatal callback error:', err)
    return NextResponse.redirect(`${origin}/login?error=server_error`)
  }
}