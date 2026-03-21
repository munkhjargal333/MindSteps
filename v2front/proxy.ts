// middleware.ts (proxy.ts-ийн дэргэд)
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { can, type Permission, type Tier } from '@/lib/permissions'

const PUBLIC_PATHS = [
  '/', '/login', '/terms', '/privacy',
  '/unauthorized', '/join', '/about', '/demo',
]

// Аль route ямар permission шаардах
const PROTECTED_ROUTES: { path: string; permission: Permission }[] = [
  { path: '/insights', permission: 'view_insights' },
  { path: '/emotions', permission: 'view_emotions' },
  { path: '/graph',    permission: 'view_graph'    },
]

function resolveTier(plan?: string, role?: string): Tier {
  if (role === 'admin')    return 'admin'
  if (plan === 'premium')  return 'premium'
  if (plan === 'pro')      return 'pro'
  return 'free'
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicPath = PUBLIC_PATHS.some(p => pathname === p) ||
                       pathname.startsWith('/auth/')

  if (pathname.startsWith('/sw.js') ||
      pathname.startsWith('/workbox') ||
      pathname === '/manifest.json') {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
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
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()

  if (process.env.NODE_ENV === 'development') {
    console.log(`[MW] ${pathname} → ${user ? '✅' : '❌'} ${error?.message ?? ''}`)
  }

  // 1. Auth шалгах
  if (!isPublicPath && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/quick', request.url))
  }

  // 2. Tier/permission шалгах (зөвхөн нэвтэрсэн хэрэглэгчид)
  if (user) {
    const meta = user.user_metadata
    const tier = resolveTier(meta?.plan, meta?.role)

    const matched = PROTECTED_ROUTES.find(r => pathname.startsWith(r.path))

    if (matched && !can(tier, matched.permission)) {
      // /unauthorized?from=/graph гэх мэт redirect
      const url = new URL('/unauthorized', request.url)
      url.searchParams.set('from', pathname)
      url.searchParams.set('tier', tier)
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}