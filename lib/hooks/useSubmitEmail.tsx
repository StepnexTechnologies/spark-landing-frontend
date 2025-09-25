import {useState} from "react";

export function useSubmitEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseNumber, setResponseNumber] = useState<number | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const submitEmail = async (value: string, type: 'email' | 'phone' = 'email'): Promise<{ number: number | null; message: string }> => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const payload = type === 'email' 
        ? { email: value }
        : { phone_number: value };
        
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/landing/waitlist/enter`, {
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
        throw new Error(data.message || "Failed to submit email");
      }

      // if (typeof data.waitlist_id !== "string" || typeof data.message !== "string") {
      //   throw new Error("Invalid response format");
      // }

      setResponseNumber(data.waitlist_number);
      setResponseMessage(data.message);

      return { number: data.waitlist_number, message: data.message };
    } catch (err) {
      const errorMessage = (err as Error).name === "AbortError" ? "Request timed out" : (err as Error).message;
      setError(errorMessage);
      return { number: null, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { submitEmail, loading, error, responseNumber, responseMessage };
}
