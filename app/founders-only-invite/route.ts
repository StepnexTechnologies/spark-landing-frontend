import {NextRequest, NextResponse} from 'next/server';

export async function GET(request: NextRequest) {
  // Redirect to the creator earn landing page
  const redirectUrl = new URL('/creator/earn', request.url);

  // Return a redirect response with a temporary redirect status
  return NextResponse.redirect(redirectUrl, { status: 307 });
}
