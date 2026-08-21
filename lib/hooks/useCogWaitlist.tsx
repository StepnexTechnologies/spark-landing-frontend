import { useState } from "react";

/**
 * Joins the COG (Creator Open Graph) waitlist with an email plus the platform
 * handles collected by the Creator AI Consent Audit tool. Mirrors the
 * useSubmitEmail waitlist hook: same API base, 10s abort timeout, error
 * surfaced as state.
 */
export function useCogWaitlist() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    email: string,
    platforms: Record<string, string>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/v1/creator/cog-waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, platforms }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.detail || "Failed to submit");
      }

      return true;
    } catch (err) {
      const errorMessage =
        (err as Error).name === "AbortError" ? "Request timed out" : (err as Error).message;
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
