import "./globals.css";
import { Roboto } from "next/font/google";
import type React from "react";
import { RootLayoutClient } from "./root-layout-client";
import Script from "next/script";
import type { Metadata } from "next";
import CookieConsentScript from "@/components/CookieConsentScript";
import {
  ORGANIZATION_ID,
  ORGANIZATION_SOCIAL_URLS,
  SITE_URL,
  WEBSITE_ID,
  siteUrl,
} from "@/lib/urls";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Fail-open: only an explicit dev.* SITE_URL is treated as non-prod, so a missing
// or misconfigured value can't accidentally noindex production.
const isProduction = !process.env.SITE_URL?.startsWith('https://dev.')

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: isProduction ? undefined : { index: false, follow: false },
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
const FB_DOMAIN_VERIFICATION = process.env.NEXT_PUBLIC_FB_DOMAIN_VERIFICATION;

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

// Registers the GA4 property in the dataLayer queue. Runs beforeInteractive so
// it precedes any web-vitals metric events — if this ran afterInteractive there
// would be a race where FCP/TTFB callbacks push events before the config is
// queued, causing gtag.js to drop them on arrival.
// Cost: two dataLayer.push() calls (~0.5 ms) — negligible vs the original full
// GTAG_INIT which also fired the page_view IIFE from the blocking head path.
const GTAG_CONFIG = (id: string) => `
gtag('js', new Date());
gtag('config', '${id}', {
  send_page_view: false,
  cookie_flags: 'SameSite=None;Secure',
});
`.trim();

// page_view fires afterInteractive (post-paint). Trade-off: users who close the
// tab before hydration (~<1 s) are not counted. Acceptable for a marketing site
// where sub-second visits are not meaningful conversions.
// usePageViewTracking handles SPA navigations and skips the first mount to avoid
// double-counting this event.
const GTAG_PAGE_VIEW = `
(function(){
  var path = location.pathname + location.search;
  var href = location.href;
  var title = document.title;
  gtag('event', 'page_view', { page_path: path, page_location: href, page_title: title });
  dataLayer.push({ event: 'page_view', page_path: path, page_location: href, page_title: title });
})();
`.trim();

// Site-wide entity graph: declares the Sparkonomy Organization + WebSite once
// for every page, so the brand is a consistent entity and author `worksFor`
// references (@id .../#organization) resolve to a real node.
const ORG_WEBSITE_JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Sparkonomy",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: siteUrl("/sparkonomy.png"),
        width: 512,
        height: 512,
      },
      sameAs: ORGANIZATION_SOCIAL_URLS,
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: "Sparkonomy",
      publisher: { "@id": ORGANIZATION_ID },
    },
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {FB_DOMAIN_VERIFICATION && (
          <meta
            name="facebook-domain-verification"
            content={FB_DOMAIN_VERIFICATION}
          />
        )}
        <meta name="theme-color" content="#000000" />

        {/* Site-wide Organization + WebSite entity graph (helps brand + author
            entity understanding in the Knowledge Graph). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: ORG_WEBSITE_JSONLD }}
        />

        {/* Warm up the GTM/GA origin so the deferred loader (below) doesn't pay
            a fresh DNS+TLS round-trip on first fire. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        <Script id="consent-default" strategy="beforeInteractive">
          {CONSENT_DEFAULT}
        </Script>

        {GTM_ID && (
          <Script id="gtm-loader" strategy="lazyOnload">
            {GTM_LOADER(GTM_ID)}
          </Script>
        )}

        {GA_MEASUREMENT_ID && (
          <>
            <Script id="gtag-config" strategy="beforeInteractive">
              {GTAG_CONFIG(GA_MEASUREMENT_ID)}
            </Script>
            <Script
              id="gtag-src"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="lazyOnload"
            />
            <Script id="gtag-page-view" strategy="afterInteractive">
              {GTAG_PAGE_VIEW}
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
      </body>
    </html>
  );
}
