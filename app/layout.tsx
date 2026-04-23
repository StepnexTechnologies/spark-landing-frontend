import "./globals.css";
import {Roboto} from "next/font/google";
import {Analytics} from "@vercel/analytics/react";
import {SpeedInsights} from "@vercel/speed-insights/next";
import type React from "react";
import {RootLayoutClient} from "./root-layout-client";
import Script from "next/script";
import type {Metadata} from "next";
import CookieConsentScript from "@/components/CookieConsentScript";

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/home-192x192Px.png", sizes: "192x192", type: "image/png" },
      { url: "/home-512x512Px.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/home-180x180Px.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Canonical URL is set per-page via Next.js metadata - removed hardcoded global canonical to avoid duplicates */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="facebook-domain-verification" content="dq4gtmx7isvdg6evweg50e3rmarkil" />
        <meta name="theme-color" content="#000000" />
          {GTM_ID && (
            <Script id="gtm-head" strategy="lazyOnload">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
          )}
      </head>
      <body className={`${roboto.className} min-h-[100dvh] w-full relative`}>

      {/* Google Tag Manager (noscript) */}
      {GTM_ID && (
        <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                          height="0" width="0" style={{display: "none", visibility: "hidden"}}></iframe></noscript>
      )}
      {/* End Google Tag Manager (noscript) */}

      <CookieConsentScript />

      {GA_MEASUREMENT_ID && (
        <>
          <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="lazyOnload"
          />

          <Script id="gtag-init" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
          </Script>
        </>
      )}
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
