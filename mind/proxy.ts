import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/terms',
  '/privacy',
  '/unauthorized',
  '/join',
  '/about',
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public эсвэл auth callback path шалгах
  const isPublicPath = PUBLIC_PATHS.some(path => pathname === path) || 
                       pathname.startsWith('/auth/')
  
  // Skip middleware for service worker and PWA files
  if (pathname.startsWith('/sw.js') || 
      pathname.startsWith('/workbox') ||
      pathname === '/manifest.json') {
    return NextResponse.next()
  }
  
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
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Session шалгах
  const { data: { user }, error } = await supabase.auth.getUser()

  // Debug logging (development only)
  if (process.env.NODE_ENV === 'development') {
    const status = user ? '✅ User' : '❌ No user';
    const errorMsg = error ? `(Error: ${error.message})` : '';
    console.log(`[MW] ${pathname} → ${status} ${errorMsg}`)
  }

  // Protected route дээр session байхгүй бол login руу
  if (!isPublicPath && !user) {
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Login хуудас дээр session байвал dashboard руу
  if (pathname === '/login' && user) {
    const redirectUrl = new URL('/quick', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, manifest.json (metadata files)
     * - Images (svg, png, jpg, etc.)
     * - Service Worker (sw.js, workbox, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}