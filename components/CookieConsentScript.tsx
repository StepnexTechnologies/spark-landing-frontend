"use client";

import Script from "next/script";

export default function CookieConsentScript() {
  return (
    <Script
      async
      src="https://cdn-cookieyes.com/client_data/373b191ed956d51fb9a13f028b26a8d6/script.js"
      id="cookieyes"
      type="text/javascript"
      strategy="afterInteractive"
    />
  );
}
