import {useState} from "react";

interface ContactFormData {
  name: string;
  email: string;
  mobile_no: string;
  message: string;
}

interface ContactFormResponse {
  submission_id: string;
  message: string;
  success: boolean;
}

export function useContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitContactForm = async (
    data: ContactFormData
  ): Promise<{ success: boolean; message: string; detail?: string }> => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/landing/waitlist/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      const responseData: ContactFormResponse = await res.json();

      if (!res.ok) {
        // Handle error response
        const errorDetail =
          (responseData as any).detail || responseData.message || "Failed to submit contact form";
        throw new Error(errorDetail);
      }

      return {
        success: responseData.success,
        message: responseData.message,
      };
    } catch (err) {
      const errorMessage =
        (err as Error).name === "AbortError"
          ? "Request timed out"
          : (err as Error).message;
      setError(errorMessage);
      return {
        success: false,
        message: "Failed to submit",
        detail: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return { submitContactForm, loading, error };
}
