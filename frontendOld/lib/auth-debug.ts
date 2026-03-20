/**
 * Auth Debug Utility
 * Development горимд ашиглах
 */

export function debugAuthFlow(stage: string, data?: any) {
  if (process.env.NODE_ENV !== 'development') return;
  
  const timestamp = new Date().toISOString();
  const style = 'background: #4F46E5; color: white; padding: 2px 6px; border-radius: 3px;';
  
  console.log(
    `%c[AUTH ${stage}]`,
    style,
    timestamp,
    data || ''
  );
}

export function debugMiddleware(pathname: string, hasUser: boolean, error?: any) {
  if (process.env.NODE_ENV !== 'development') return;
  
  const status = hasUser ? '✅ Authenticated' : '❌ No session';
  const errorMsg = error ? `⚠️ Error: ${error.message}` : '';
  
  console.log(
    `[MIDDLEWARE] ${pathname} → ${status} ${errorMsg}`
  );
}

export function debugCallback(stage: string, data?: any) {
  if (process.env.NODE_ENV !== 'development') return;
  
  console.group(`🔐 Callback ${stage}`);
  console.log('Data:', data);
  console.log('URL:', typeof window !== 'undefined' ? window.location.href : 'server');
  console.groupEnd();
}

// Browser дээр ашиглах
export function logAuthState() {
  if (typeof window === 'undefined') return;
  
  console.group('🔍 Current Auth State');
  console.log('Path:', window.location.pathname);
  console.log('Search:', window.location.search);
  console.log('Hash:', window.location.hash);
  console.log('Cookies:', document.cookie);
  console.groupEnd();
}