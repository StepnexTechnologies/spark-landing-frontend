'use client';

import { useState, useEffect } from 'react';

interface GeolocationState {
  country: string | null;
  countryCode: string | null;
  region: string | null;
  city: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to detect user's country using Vercel's built-in geolocation
 *
 * Vercel automatically provides geolocation headers on every request:
 * - x-vercel-ip-country: Country code (e.g., "IN", "US")
 * - x-vercel-ip-country-region: Region/state code
 * - x-vercel-ip-city: City name
 *
 * No configuration needed - works automatically on Vercel hosting!
 * On localhost, it will return null values (geolocation only works in production)
 */
export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    country: null,
    countryCode: null,
    region: null,
    city: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('/api/geolocation');

        if (!response.ok) {
          throw new Error('Failed to fetch location');
        }

        const data = await response.json();

        setState({
          country: data.country,
          countryCode: data.countryCode,
          region: data.region,
          city: data.city,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          country: null,
          countryCode: null,
          region: null,
          city: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to detect location',
        });
      }
    };

    fetchLocation();
  }, []);

  return state;
}

/**
 * Hook specifically for checking if user is from India
 *
 * Note: On localhost/development, this will return false since
 * Vercel geolocation only works in production. For testing,
 * you can temporarily set isIndian to true.
 */
export function useIsIndianUser(): { isIndian: boolean; isLoading: boolean } {
  const { countryCode, isLoading } = useGeolocation();

  return {
    // isIndian: countryCode === 'IN',
    isIndian: false,
    isLoading,
  };
}

export default useGeolocation;
