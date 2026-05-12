// UTM tracking helpers. Only `utm_source` and `utm_medium` are read because
// the backend's VerifyOTPInput accepts just those two (sparkonomy d5b0b2c).
// Persisted in sessionStorage so internal navigation between pages within a
// tab doesn't drop the labels picked up from the landing URL.

export const UTM_SOURCE_STORAGE_KEY = "spark_utm_source";
export const UTM_MEDIUM_STORAGE_KEY = "spark_utm_medium";

export interface UtmParams {
  utm_source: string | null;
  utm_medium: string | null;
}

function readSessionStorage(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSessionStorage(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // sessionStorage may be unavailable in private mode — tolerate silently.
  }
}

// Read from URL first, fall back to sessionStorage. If the URL has a fresh
// value, persist it so subsequent pages without query params still see it.
export function readUtmParams(searchParams: URLSearchParams): UtmParams {
  const fromUrlSource = searchParams.get("utm_source");
  const fromUrlMedium = searchParams.get("utm_medium");

  if (fromUrlSource) writeSessionStorage(UTM_SOURCE_STORAGE_KEY, fromUrlSource);
  if (fromUrlMedium) writeSessionStorage(UTM_MEDIUM_STORAGE_KEY, fromUrlMedium);

  return {
    utm_source: fromUrlSource ?? readSessionStorage(UTM_SOURCE_STORAGE_KEY),
    utm_medium: fromUrlMedium ?? readSessionStorage(UTM_MEDIUM_STORAGE_KEY),
  };
}

export function appendUtmTo(url: URL, params: UtmParams): void {
  if (params.utm_source) url.searchParams.set("utm_source", params.utm_source);
  if (params.utm_medium) url.searchParams.set("utm_medium", params.utm_medium);
}

export function clearStoredUtm(): void {
  try {
    sessionStorage.removeItem(UTM_SOURCE_STORAGE_KEY);
    sessionStorage.removeItem(UTM_MEDIUM_STORAGE_KEY);
  } catch {
    // ignore
  }
}
