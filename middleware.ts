import { NextResponse, type NextRequest } from 'next/server';
import { SITE_URL } from '@/lib/urls';

const LANDING_PREFIXES = [
  '/creator/promo',
  '/creator/promo-f',
  '/creator/promo-w',
  '/creator/earn',
];

// Path prefixes whose content AI models may train on. Must match
// AI_TRAINING_ALLOWED in app/robots.ts and AI_TRAINING_ALLOWED_SOURCES in
// next.config.ts — a Content-Signal that contradicts robots.txt is worse than
// either rule on its own. The homepage is allowed as an exact match; a `/`
// prefix would open the whole site.
const AI_TRAINING_PREFIXES = ['/blogs', '/creator/earn', '/creator/promo'];

// Unlisted pages — must match UNLISTED_PATHS in app/robots.ts and
// next.config.ts. Listed here so this middleware does not overwrite their
// stricter `ai-search=no` with the site-wide default.
const UNLISTED_PREFIXES = [
  '/legal/trusted-partner-terms',
  '/legal/trusted-partner-program-guide',
];

function contentSignalFor(pathname: string) {
  const lower = pathname.toLowerCase();

  if (UNLISTED_PREFIXES.some((p) => lower === p || lower.startsWith(p + '/'))) {
    return 'ai-train=no, ai-search=no';
  }
  // startsWith, not an exact/segment match, so `-f` and `-w` promo variants ride
  // along with `/creator/promo`.
  if (lower === '/' || AI_TRAINING_PREFIXES.some((p) => lower.startsWith(p))) {
    return 'ai-train=yes, ai-search=yes';
  }
  return 'ai-train=no, ai-search=yes';
}

function withContentSignal(res: NextResponse, pathname: string) {
  res.headers.set('Content-Signal', contentSignalFor(pathname));
  return res;
}

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  if (host === "sparkonomy.com") {
    const url = new URL(`${req.nextUrl.pathname}${req.nextUrl.search}`, SITE_URL);
    return NextResponse.redirect(url, 301);
  }

  const { pathname } = req.nextUrl;
  const lower = pathname.toLowerCase();

  const isLanding = LANDING_PREFIXES.some(
    (p) => lower === p || lower.startsWith(p + '/'),
  );
  if (!isLanding) return withContentSignal(NextResponse.next(), pathname);

  if (pathname === lower) return withContentSignal(NextResponse.next(), pathname);

  const url = req.nextUrl.clone();
  url.pathname = lower;
  return withContentSignal(NextResponse.redirect(url, 308), pathname);
}

export const config = {
  matcher: '/((?!_next/|api/|.*\\..*).*)',
};
