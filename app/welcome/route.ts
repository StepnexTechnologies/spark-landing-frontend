import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Extract the email parameter from the URL
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || '';
  
  // Log the redirect for monitoring (optional)
  console.log(`Redirecting email: ${email} to Tally form`);
  
  // Construct the destination URL with the email parameter
  const redirectUrl = `https://tally.so/r/3lMzGB?email=${email}`;
  
  // Return a redirect response with a temporary redirect status
  return NextResponse.redirect(redirectUrl, { status: 307 });
}
