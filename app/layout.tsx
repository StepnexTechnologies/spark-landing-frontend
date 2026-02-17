import "./globals.css";
import {Roboto} from "next/font/google";
import {Analytics} from "@vercel/analytics/react";
import {SpeedInsights} from "@vercel/speed-insights/next";
import type React from "react";
import {RootLayoutClient} from "./root-layout-client";
import Script from "next/script";
import type {Metadata} from "next";

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/home-16x16Px.png", sizes: "16x16", type: "image/png" },
      { url: "/home-44x44Px.png", sizes: "44x44", type: "image/png" },
    ],
  },
};

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
          <Script id="gtm-head" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K66374CX');`}
          </Script>
          <Script
              async
              src="https://cdn-cookieyes.com/client_data/373b191ed956d51fb9a13f028b26a8d6/script.js"
              id={'cookieyes'}
              type={'text/javascript'}
              strategy="afterInteractive"
          />
      </head>
      <body className={`${roboto.className} min-h-[100dvh] w-full relative`}>

      {/* Google Tag Manager (noscript) */}
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K66374CX"
                        height="0" width="0" style={{display: "none", visibility: "hidden"}}></iframe></noscript>
      {/* End Google Tag Manager (noscript) */}

      <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-87CRRH8FXM"
          strategy="afterInteractive"
      />

      <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-87CRRH8FXM', {
              page_path: window.location.pathname,
            });
          `}
      </Script>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
