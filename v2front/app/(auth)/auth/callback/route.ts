import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle OAuth / signup errors
  if (error) {
    if (error === 'access_denied') {
      return NextResponse.redirect(`${origin}/join`)
    }
    if (errorDescription?.includes('Database error saving new user')) {
      return NextResponse.redirect(`${origin}/join`)
    }
    return NextResponse.redirect(
      `${origin}/login?error=${error}&message=${encodeURIComponent(errorDescription ?? 'Алдаа гарлаа')}`
    )
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login`)
  }

  try {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      const isUnauthorized =
        exchangeError.message.includes('not authorized') ||
        exchangeError.message.includes('Signup Error') ||
        exchangeError.message.includes('User not allowed')

      if (isUnauthorized) {
        return NextResponse.redirect(`${origin}/join`)
      }

      return NextResponse.redirect(
        `${origin}/login?error=auth_fail&message=${encodeURIComponent(exchangeError.message)}`
      )
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.redirect(`${origin}/join`)
    }

    return NextResponse.redirect(`${origin}/home`)
  } catch {
    return NextResponse.redirect(`${origin}/login?error=server_error`)
  }
}
