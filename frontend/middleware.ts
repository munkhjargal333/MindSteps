import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Public paths - хамгаалалтгүй
const PUBLIC_PATHS = [
  '/login',
  // '/register', 
  '/terms',
  '/privacy',
  '/',
  '/auth/callback', // Чухал!
  '/unauthorized', // Энийг заавал нэмээрэй!
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public path бол session check хийхгүй
  const isPublicPath = PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith('/auth/'))
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Session refresh (callback дээр үүсгэсэн session-г хүлээн авах)
  const { data: { user } } = await supabase.auth.getUser()

  // Protected route дээр session байхгүй бол login руу redirect
  if (!isPublicPath && !user) {
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Login/Register дээр session байвал dashboard руу redirect  
  if ((pathname === '/login' || pathname === '/register') && user) {
    const redirectUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}