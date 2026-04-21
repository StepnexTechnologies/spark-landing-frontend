import {useState} from "react";

export function useSubmitEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseNumber, setResponseNumber] = useState<number | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [alreadyOnWaitlist, setAlreadyOnWaitlist] = useState(false);

  const submitEmail = async (
    value: string,
    type: 'email' | 'phone' = 'email',
    country?: string | null
  ): Promise<{ number: number | null; message: string; alreadyOnWaitlist: boolean }> => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const payload = type === 'email'
        ? { email: value, ...(country ? { country } : {}) }
        : { phone_number: value };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/v1/creator/waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.detail || "Failed to submit");
      }

      setResponseNumber(data.waitlist_number);
      setResponseMessage(data.message);
      setAlreadyOnWaitlist(data.already_on_waitlist ?? false);

      return {
        number: data.waitlist_number,
        message: data.message,
        alreadyOnWaitlist: data.already_on_waitlist ?? false,
      };
    } catch (err) {
      const errorMessage = (err as Error).name === "AbortError" ? "Request timed out" : (err as Error).message;
      setError(errorMessage);
      return { number: null, message: errorMessage, alreadyOnWaitlist: false };
    } finally {
      setLoading(false);
    }
  };

  return { submitEmail, loading, error, responseNumber, responseMessage, alreadyOnWaitlist };
}
