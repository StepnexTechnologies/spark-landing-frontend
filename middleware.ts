import { NextResponse, type NextRequest } from 'next/server';

const LANDING_PREFIXES = [
  '/creator/promo',
  '/creator/promo-f',
  '/creator/promo-w',
  '/creator/earn',
];

const CONTENT_SIGNAL = 'ai-train=no, ai-search=yes';

function withContentSignal(res: NextResponse) {
  res.headers.set('Content-Signal', CONTENT_SIGNAL);
  return res;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const lower = pathname.toLowerCase();

  const isLanding = LANDING_PREFIXES.some(
    (p) => lower === p || lower.startsWith(p + '/'),
  );
  if (!isLanding) return withContentSignal(NextResponse.next());

  if (pathname === lower) return withContentSignal(NextResponse.next());

  const url = req.nextUrl.clone();
  url.pathname = lower;
  return withContentSignal(NextResponse.redirect(url, 308));
}

export const config = {
  matcher: '/((?!_next/|api/|.*\\..*).*)',
};
