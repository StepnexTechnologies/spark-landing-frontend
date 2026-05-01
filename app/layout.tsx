import "./globals.css";
import { Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type React from "react";
import { RootLayoutClient } from "./root-layout-client";
import Script from "next/script";
import type { Metadata } from "next";
import CookieConsentScript from "@/components/CookieConsentScript";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/home-192x192Px.png", sizes: "192x192", type: "image/png" },
      { url: "/home-512x512Px.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/home-180x180Px.png", sizes: "180x180", type: "image/png" }],
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Consent Mode v2 — explicit granted defaults so GA/Ads fire fully on first
// hit, including for users who never interact with the cookie banner.
const CONSENT_DEFAULT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
  functionality_storage: 'granted',
  security_storage: 'granted',
});
`.trim();

const GTM_LOADER = (id: string) => `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');
`.trim();

// Fire first page_view inline pre-hydration; usePageViewTracking handles SPA navs.
const GTAG_INIT = (id: string) => `
gtag('js', new Date());
gtag('config', '${id}', {
  send_page_view: false,
  cookie_flags: 'SameSite=None;Secure',
});
(function(){
  var path = location.pathname + location.search;
  var href = location.href;
  var title = document.title;
  gtag('event', 'page_view', { page_path: path, page_location: href, page_title: title });
  dataLayer.push({ event: 'page_view', page_path: path, page_location: href, page_title: title });
})();
`.trim();

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta
          name="facebook-domain-verification"
          content="dq4gtmx7isvdg6evweg50e3rmarkil"
        />
        <meta name="theme-color" content="#000000" />

        {/* Warm up the GTM/GA origin so the deferred loader (below) doesn't pay
            a fresh DNS+TLS round-trip on first fire. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        <Script id="consent-default" strategy="beforeInteractive">
          {CONSENT_DEFAULT}
        </Script>

        {GTM_ID && (
          <Script id="gtm-loader" strategy="afterInteractive">
            {GTM_LOADER(GTM_ID)}
          </Script>
        )}

        {GA_MEASUREMENT_ID && (
          <>
            <Script
              id="gtag-src"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="beforeInteractive">
              {GTAG_INIT(GA_MEASUREMENT_ID)}
            </Script>
          </>
        )}
      </head>
      <body className={`${roboto.className} min-h-[100dvh] w-full relative`}>
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        <CookieConsentScript />

        <RootLayoutClient>{children}</RootLayoutClient>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
