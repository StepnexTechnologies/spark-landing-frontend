"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const COOKIEYES_SITE_ID = process.env.NEXT_PUBLIC_COOKIEYES_SITE_ID;

export default function CookieConsentScript() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 15_000);
    return () => clearTimeout(timer);
  }, []);

  if (!ready || !COOKIEYES_SITE_ID) return null;

  return (
    <Script
      async
      src={`https://cdn-cookieyes.com/client_data/${COOKIEYES_SITE_ID}/script.js`}
      id="cookieyes"
      type="text/javascript"
      strategy="lazyOnload"
    />
  );
}
