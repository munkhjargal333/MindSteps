// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { can, type Permission, type Tier } from '@/lib/permissions'

const PUBLIC_PATHS = [
  '/', '/login', '/terms', '/privacy',
  '/unauthorized', '/join', '/about', '/demo',
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
function resolveTierFromAuth(user: any): Tier {
  // 1. Админ эрх шалгах
  if (user?.app_metadata?.role === 'admin') return 'admin'
  
  // 2. JWT-ийн app_metadata доторх tier-ийг унших
  const tier = user?.app_metadata?.tier
  
  // Зөвшөөрөгдсөн утга мөн эсэхийг шалгах
  if (tier === 'premium' || tier === 'pro') return tier
  
  return 'free'
}

export async function proxy(request: NextRequest) {
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

  // 3. JWT-ээс хэрэглэгчийг унших (Энэ нь Metadata-г давхар авчирна)
  const { data: { user }, error } = await supabase.auth.getUser()

  if (process.env.NODE_ENV === 'development') {
    console.log(`[MW] ${pathname} | User: ${user?.email ?? 'Guest'} | Tier: ${user?.app_metadata?.tier ?? 'free'}`)
  }

  // 4. Нэвтрээгүй хэрэглэгчийг хамгаалах
  if (!isPublicPath && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname) // Нэвтэрсний дараа буцаж ирэх замыг хадгалах
    return NextResponse.redirect(loginUrl)
  }

  // 5. Нэвтэрсэн хэрэглэгч /login руу орохыг оролдвол
  if (pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/quick', request.url))
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