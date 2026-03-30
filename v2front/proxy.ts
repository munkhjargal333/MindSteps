// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { can, type Permission, type Tier } from '@/lib/permissions'
import type { User } from '@supabase/supabase-js'

const PUBLIC_PATHS = [
  '/', '/login', '/terms', '/privacy',
  '/unauthorized', '/join', '/about', '/demo', '/upgrade',
]

const PROTECTED_ROUTES: { path: string; permission: Permission }[] = [
  { path: '/insights', permission: 'view_insights' },
  { path: '/emotions', permission: 'view_emotions' },
  { path: '/graph',    permission: 'view_graph'    },
]

/**
 * JWT-ийн app_metadata-аас tier-ийг унших функц.
 * Хэрэглэгч өөрөө засах боломжгүй хэсэг (app_metadata) тул аюулгүй.
 */
function resolveTierFromAuth(user: User | null): Tier {
  const tier = user?.app_metadata?.tier;
  const validTiers: Tier[] = ['demo', 'pro', 'free'];

  if (typeof tier === 'string' && (validTiers as string[]).includes(tier)) {
    return tier as Tier;
  }

  return 'free';
}

export async function proxy(request: NextRequest) {

  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  // 1. Нийтэд нээлттэй зам эсэхийг шалгах
  const isPublicPath = PUBLIC_PATHS.some(p => pathname === p) ||
                       pathname.startsWith('/auth/')

  // Static болон Service Worker файлуудыг алгасах
  if (pathname.startsWith('/sw.js') ||
      pathname.startsWith('/workbox') ||
      pathname === '/manifest.json') {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // 2. Supabase Client үүсгэх
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. JWT-ээс хэрэглэгчийг унших (Энэ нь Metadata-г давхар авчирна)
  const { data: { user }, error } = await supabase.auth.getUser()

  if (process.env.NODE_ENV === 'development') {
    console.log(`[MW] ${pathname} | User: ${user?.email ?? 'Guest'} | Tier: ${user?.app_metadata?.tier ?? 'demo'}`)
  }

  // 4. Нэвтрээгүй хэрэглэгчийг хамгаалах
  if (!isPublicPath && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname) // Нэвтэрсний дараа буцаж ирэх замыг хадгалах
    return NextResponse.redirect(loginUrl)
  }

  // 5. Нэвтэрсэн хэрэглэгч /login руу орохыг оролдвол
  if (pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // 6. Tier/Permission шалгах
  if (user) {
    const tier = resolveTierFromAuth(user)
    const matched = PROTECTED_ROUTES.find(r => pathname.startsWith(r.path))

    if (matched && !can(tier, matched.permission)) {
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