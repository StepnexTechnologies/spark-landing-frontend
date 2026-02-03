import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route to get user's geolocation from Vercel headers
 *
 * Vercel automatically provides these headers on every request:
 * - x-vercel-ip-country: Country code (e.g., "IN", "US")
 * - x-vercel-ip-country-region: Region/state code
 * - x-vercel-ip-city: City name
 *
 * No configuration needed - works automatically on Vercel hosting!
 * -- chirag
 * 
 */
export async function GET(request: NextRequest) {
  const country = request.headers.get('x-vercel-ip-country') || null;
  const countryRegion = request.headers.get('x-vercel-ip-country-region') || null;
  const city = request.headers.get('x-vercel-ip-city') || null;

  return NextResponse.json({
    country,
    countryCode: country,
    region: countryRegion,
    city,
  });
}
