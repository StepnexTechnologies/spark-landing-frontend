import type { Metadata } from "next";
import Script from "next/script";
import { Manrope, Roboto } from "next/font/google";
import CreatorAIConsentAudit from "./CreatorAIConsentAudit";

// The tool's design (ported 1:1 from the reference prototype) sets Manrope on
// headings/buttons and Roboto — including the 500 weight the root layout
// doesn't load — on body copy. Exposed as CSS variables the client component
// picks up.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-roboto-tool",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkonomy.com"),
  title: "Creator AI Consent Audit — Are You Protected From AI Training? | Sparkonomy",
  description:
    "Free AI consent audit for creators. Check your AI training opt-out settings on YouTube, Instagram, TikTok, Facebook, LinkedIn, Snapchat, Twitch and X in minutes — and see what platform settings don't protect on the open web.",
  keywords: [
    "creator AI consent audit",
    "AI training opt out",
    "stop AI training on my content",
    "YouTube third-party training",
    "Meta AI opt out creators",
    "TikTok AI training settings",
    "LinkedIn generative AI data",
    "protect content from AI scraping",
    "creator AI protection checklist",
  ],
  authors: [{ name: "Sparkonomy" }],
  creator: "Sparkonomy",
  publisher: "Sparkonomy",
  alternates: {
    canonical: "https://www.sparkonomy.com/blogs/tools/creator-ai-consent-audit",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "https://www.sparkonomy.com/blogs/tools/creator-ai-consent-audit",
    title: "Are you protected from AI misuse & training? — Free Creator Audit",
    description:
      "Run a free audit of your AI training opt-out settings across every major platform, in minutes. Built for creators by Sparkonomy.",
    siteName: "Sparkonomy",
    locale: "en_IN",
    images: [
      {
        url: "https://www.sparkonomy.com/og-creator-ai-consent-audit.png",
        alt: "Creator AI Consent Audit by Sparkonomy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sparkonomy",
    title: "Are you protected from AI misuse & training? — Free Creator Audit",
    description:
      "Add your handles, get a platform-by-platform AI training opt-out checklist — plus what your settings still don't protect on the open web.",
    images: ["https://www.sparkonomy.com/og-creator-ai-consent-audit.png"],
  },
};

// SCHEMA.ORG (AEO / GEO — AI search engines read this). The FAQ answers are the
// tool's own platform guidance, kept in sync with the PLATFORMS config copy.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Creator AI Consent Audit",
      url: "https://www.sparkonomy.com/blogs/tools/creator-ai-consent-audit",
      description:
        "Free audit for content creators that checks AI training opt-out settings across YouTube, Instagram, TikTok, Facebook, LinkedIn, Snapchat, Twitch, X and Reddit. Shows where each platform's AI training control lives, verifies YouTube's third-party training status via YouTube's public API, and explains why platform settings alone don't protect content on the open web.",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      inLanguage: "en",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      creator: {
        "@type": "Organization",
        name: "Sparkonomy",
        url: "https://www.sparkonomy.com",
        description:
          "Financial and business guidance platform for content creators and influencers.",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I stop AI companies from training on my YouTube content?",
          acceptedAnswer: {
            "@type": "Answer",
            text: 'Open YouTube Studio → Settings → Channel → Advanced settings and find "Third-party training", where you can allow or disallow AI companies from using your content. If your channel is managed by a Content Manager / MCN, this control may live there instead. YouTube exposes a public API for this status, but a fresh toggle can take up to 7 days to show up via the API.',
          },
        },
        {
          "@type": "Question",
          name: "How do I opt out of AI training on Instagram?",
          acceptedAnswer: {
            "@type": "Answer",
            text: 'Open Instagram → your profile → menu → Settings and privacy → Accounts Center → "Your information and permissions" and look for "AI at Meta". Search "AI" in settings if you don\'t see it directly — Meta renames this often. Depending on your region, you may see an objection form instead of a plain toggle.',
          },
        },
        {
          "@type": "Question",
          name: "How do I opt out of AI training on TikTok?",
          acceptedAnswer: {
            "@type": "Answer",
            text: 'Go to Profile → menu → Settings and privacy → Privacy and look under "Personalization and data" for AI / data-sharing controls. In the EU/UK, TikTok\'s Privacy Center also has a separate "right to object" form specifically for AI training.',
          },
        },
        {
          "@type": "Question",
          name: "How do I object to Meta using my Facebook content for AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: 'Meta provides an AI data objection form (available from Facebook\'s help pages). On mobile: Settings & Privacy → Accounts Center → "Your information and permissions". Meta generally works on a "submit an objection" model here, not a plain on/off switch.',
          },
        },
        {
          "@type": "Question",
          name: "How do I turn off generative AI data use on LinkedIn?",
          acceptedAnswer: {
            "@type": "Answer",
            text: 'On desktop, open LinkedIn\'s "Data for Generative AI Improvement" setting under Settings → Data privacy and toggle it off. On mobile: profile photo → Settings → Data privacy → "Data for Generative AI Improvement" → toggle off.',
          },
        },
        {
          "@type": "Question",
          name: "How do I stop Snapchat from training AI on my public content?",
          acceptedAnswer: {
            "@type": "Answer",
            text: 'Open Snapchat → Bitmoji/profile icon → gear icon → Privacy Controls → "Manage My Information" and toggle off "use my Public Content to train generative AI".',
          },
        },
        {
          "@type": "Question",
          name: "Where is Twitch's AI training setting?",
          acceptedAnswer: {
            "@type": "Answer",
            text: 'Best done from a desktop browser: Settings → Privacy, then scroll all the way down — "Training for Generative AI" sits right at the bottom of that Privacy page.',
          },
        },
        {
          "@type": "Question",
          name: "How do I stop Grok from training on my X (Twitter) posts?",
          acceptedAnswer: {
            "@type": "Answer",
            text: 'Go to More → Settings and privacy → Privacy and safety → Data sharing and personalization, find "Grok and third-party collaborators" and toggle it off.',
          },
        },
        {
          "@type": "Question",
          name: "Can I opt out of AI training on Reddit?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Reddit provides no opt-out — all your content can be used for AI training, covered under Reddit's platform-level data licensing deals.",
          },
        },
        {
          "@type": "Question",
          name: "Do platform AI settings protect my content on the open web?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Even if you turn off AI training on every social platform, your content can still be found elsewhere on the web, and AI crawlers can find copies of it and use them for AI training. You need open-web protection too — such as a machine-readable consent record that tells AI systems what they can and cannot use.",
          },
        },
      ],
    },
  ],
};

export default function CreatorAIConsentAuditPage() {
  return (
    <>
      <Script
        id="creator-ai-consent-audit-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={`${manrope.variable} ${roboto.variable}`}>
        <CreatorAIConsentAudit />
      </div>
    </>
  );
}
