"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function CookieConsentScript() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 15_000);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return null;

  return (
    <Script
      async
      src="https://cdn-cookieyes.com/client_data/373b191ed956d51fb9a13f028b26a8d6/script.js"
      id="cookieyes"
      type="text/javascript"
      strategy="lazyOnload"
    />
  );
}
