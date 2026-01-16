import "./globals.css";
import {Montserrat} from "next/font/google";
import {Analytics} from "@vercel/analytics/react";
import {SpeedInsights} from "@vercel/speed-insights/next";
import type React from "react";
import {RootLayoutClient} from "./root-layout-client";
import Script from "next/script";

const inter = Montserrat({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   metadataBase: new URL('https://www.sparkonomy.com'),
//   title: {
//     default: "Sparkonomy",
//     template: "%s | Sparkonomy"
//   },
//   description: "Welcome to Sparkonomy - your gateway to innovation and excellence.",
//   keywords: ["sparkonomy", "landing page", "innovation", "technology", "creator", "social media", "influencer", "community", "platform"],
//   authors: [{ name: "Sparkonomy Team" }],
//   creator: "Sparkonomy",
//   publisher: "Sparkonomy",
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       'max-video-preview': -1,
//       'max-image-preview': 'large',
//       'max-snippet': -1,
//     },
//   },
//   openGraph: {
//     type: "website",
//     locale: "en_US",
//     url: "https://www.sparkonomy.com/",
//     title: "Spark - Landing Page",
//     description: "Welcome to Sparkonomy - your gateway to innovation and excellence.",
//     siteName: "Spark",
//     images: [
//       {
//         url: "/sparkonomy.png",
//         width: 1200,
//         height: 630,
//         alt: "Spark Logo",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Sparkonomy - Landing Page",
//     description: "Welcome to Sparkonomy - your gateway to innovation and excellence.",
//     images: ["/sparkonomy.png"],
//   },
//   alternates: {
//     canonical: "https://www.sparkonomy.com/",
//   },
//   verification: {
//     google: "ptQwDw_lS9CEO3U7kNf5elzz79R6I4dXVLGyP1dfJY0",
//   },
//
// };

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Canonical URL is set per-page via Next.js metadata - removed hardcoded global canonical to avoid duplicates */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="facebook-domain-verification" content="dq4gtmx7isvdg6evweg50e3rmarkil" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} min-h-[100dvh] w-full relative`}>
      <Script
          type="text/javascript"
          src="https://cdn.cookie-script.com/s/b1693d0f866c8a85e471cfbd6dc87cd1.js"
          strategy="beforeInteractive"
      />

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
