import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')
  const origin = requestUrl.origin

  // 1. OAuth эсвэл Signup-аас ирж буй шууд алдаанууд
  if (error) {
    console.error('Auth Error Triggered:', error, error_description)
    
    // Хэрэв манай Trigger эсвэл Supabase бүртгэлийг цуцалсан бол (access_denied)
    // Шууд unauthorized хуудас руу явуулна
    if (error === 'access_denied' || error_description?.includes('not authorized')) {
      return NextResponse.redirect(`${origin}/unauthorized`)
    }
    
    // Бусад ерөнхий алдаанууд дээр login руу мессежтэй буцаана
    return NextResponse.redirect(
      `${origin}/login?error=${error}&message=${encodeURIComponent(error_description || 'Алдаа гарлаа')}`
    )
  }

  // 2. Код байхгүй бол нэвтрэх боломжгүй
  if (!code) {
    return NextResponse.redirect(`${origin}/login`)
  }

  try {
    const supabase = await createClient()
    
    // 3. Кодыг Session болгож солих (Энэ үед Trigger дахин шалгагдаж магадгүй)
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Exchange error:', exchangeError.message)

      // Хэрэв Trigger-ээс болон бусад шалтгаанаар "Бүртгэлгүй" гэж үзвэл
      // Манай unauthorized хуудас руу шиднэ
      const isNotAllowed = 
        exchangeError.message.includes('User not found') || 
        exchangeError.message.includes('not authorized') ||
        exchangeError.message.includes('Signup Error'); // Таны Trigger-ийн RAISE EXCEPTION мессеж

      if (isNotAllowed) {
        return NextResponse.redirect(`${origin}/unauthorized`)
      }

      // Бусад төрлийн техник алдаа (хугацаа дууссан код г.м)
      return NextResponse.redirect(
        `${origin}/login?error=auth_fail&message=${encodeURIComponent(exchangeError.message)}`
      )
    }

    // 4. Бүх зүйл амжилттай бол Dashboard руу
    if (data?.session) {
      return NextResponse.redirect(`${origin}/dashboard`)
    }

  } catch (err) {
    console.error('Fatal Callback Error:', err)
    return NextResponse.redirect(`${origin}/login?error=server_error`)
  }

  // default fallback
  return NextResponse.redirect(`${origin}/login`)
}