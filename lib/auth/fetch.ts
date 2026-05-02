import { AuthApiError, type AuthApiFieldError, type MessageCode } from "./errors";

// 10s matches the existing waitlist/contact hooks (lib/hooks/useSubmitEmail.tsx,
// lib/hooks/useContactForm.tsx) so failure-mode UX feels consistent across the app.
const TIMEOUT_MS = 10_000;

interface AuthFetchInit {
  method: "POST";
  body?: unknown;
}

interface ErrorEnvelope {
  message_code?: string;
  detail?: string;
  errors?: AuthApiFieldError[];
}

export async function authFetch<T>(path: string, init: AuthFetchInit): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  if (!base) {
    throw new AuthApiError(0, "NETWORK_ERROR", "NEXT_PUBLIC_API_BASE is not configured");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      method: init.method,
      // credentials: include is required for the server to set/read the
      // creator_access_token / creator_refresh_token / creator_returning_user
      // cookies on cross-origin responses.
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    const isAbort = (err as Error)?.name === "AbortError";
    throw new AuthApiError(
      0,
      "NETWORK_ERROR",
      isAbort ? "Request timed out" : (err as Error)?.message,
    );
  }
  clearTimeout(timeoutId);

  let parsed: unknown = null;
  // 204s are unlikely on this surface (every documented response has a body),
  // but we still guard against an empty body so JSON.parse doesn't throw.
  const text = await response.text();
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new AuthApiError(response.status, "NETWORK_ERROR", "Malformed response");
    }
  }

  if (!response.ok) {
    const env = (parsed ?? {}) as ErrorEnvelope;
    const code = (env.message_code ?? "NETWORK_ERROR") as MessageCode;
    throw new AuthApiError(response.status, code, env.detail, env.errors);
  }

  return parsed as T;
}
