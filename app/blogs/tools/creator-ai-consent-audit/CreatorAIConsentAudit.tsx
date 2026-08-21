"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useCogWaitlist } from "@/lib/hooks/useCogWaitlist";

// ──────────────────────────────────────────
//  BRAND ICONS
//  Real brand glyph paths, sourced from Simple Icons (CC0) — copied verbatim
//  from the reference prototype. YouTube, LinkedIn and Reddit ship their own
//  frame as part of the path already, so those render at full scale with no
//  added background tile; the rest get a brand-color rounded tile behind a
//  centered, slightly scaled-down glyph.
// ──────────────────────────────────────────
const ICONS: Record<string, string> = {
  youtube: `<path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>`,
  linkedin: `<path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>`,
  reddit: `<path fill="#FF4500" d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z"/>`,
  instagram: `<rect width="24" height="24" rx="6" fill="#E4405F"/><g transform="translate(12,12) scale(.72) translate(-12,-12)"><path fill="#fff" d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></g>`,
  facebook: `<rect width="24" height="24" rx="6" fill="#1877F2"/><g transform="translate(12,12) scale(.72) translate(-12,-12)"><path fill="#fff" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></g>`,
  tiktok: `<rect width="24" height="24" rx="6" fill="#000"/><g transform="translate(12,12) scale(.72) translate(-12,-12)"><path fill="#fff" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></g>`,
  snapchat: `<rect width="24" height="24" rx="6" fill="#FFFC00"/><g transform="translate(12,12) scale(.72) translate(-12,-12)"><path fill="#fff" d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/></g>`,
  twitch: `<rect width="24" height="24" rx="6" fill="#6441A5"/><g transform="translate(12,12) scale(.78) translate(-12,-12)"><path fill="#fff" d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></g>`,
  x: `<rect width="24" height="24" rx="6" fill="#000"/><g transform="translate(12,12) scale(.72) translate(-12,-12)"><path fill="#fff" d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/></g>`,
};

const Avatar = ({ k, size = 34 }: { k: string; size?: number }) => (
  <svg
    className="block shrink-0"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ borderRadius: 0 }}
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: ICONS[k] }}
  />
);

// ──────────────────────────────────────────
//  PLATFORM CONFIG (copy kept verbatim from the reference prototype)
// ──────────────────────────────────────────
type PlatformType = "auto" | "manual" | "none";

type Platform = {
  key: string;
  name: string;
  sub: string;
  type: PlatformType;
  primary: boolean;
  desktopUrl?: string;
  steps?: string[];
  flag?: string;
  note?: string;
};

const PLATFORMS: Platform[] = [
  {
    key: "youtube",
    name: "YouTube",
    sub: "Channel ID (e.g. UCxxxxxxxx)",
    type: "auto",
    primary: true,
    desktopUrl: "https://studio.youtube.com",
    steps: [
      "Open YouTube Studio → Settings → Channel → Advanced settings.",
      'Find "Third-party training". Allow or disallow AI companies from using your content.',
      "Managed by a Content Manager / MCN? This control may live there instead. Check with whoever handles your channel's Content ID.",
    ],
    flag: "This is the one platform with a real public API for checking status, no login needed. Note: a fresh toggle can take up to 7 days to show up via the API, so a check right after changing it may look unconfirmed for a few days. That's normal, not an error.",
  },
  {
    key: "instagram",
    name: "Instagram",
    sub: "@handle",
    type: "manual",
    primary: true,
    desktopUrl: "https://privacycenter.instagram.com/dialog/learn-more-about-genai/",
    steps: [
      "Open Instagram → your profile → menu (≡) → Settings and privacy.",
      'Tap Accounts Center → "Your information and permissions."',
      'Look for "AI at Meta". Search "AI" in settings if you don\'t see it directly, Meta renames this often.',
      "Depending on your region, you may see an objection form instead of a plain toggle.",
    ],
  },
  {
    key: "tiktok",
    name: "TikTok",
    sub: "@handle",
    type: "manual",
    primary: true,
    desktopUrl: "https://www.tiktok.com/setting",
    steps: [
      "Profile → ≡ menu → Settings and privacy → Privacy.",
      'Look under "Personalization and data" for AI / data-sharing controls.',
      "In the EU/UK, TikTok's Privacy Center also has a separate \"right to object\" form specifically for AI training.",
    ],
  },
  {
    key: "facebook",
    name: "Facebook",
    sub: "profile/page name",
    type: "manual",
    primary: false,
    desktopUrl: "https://www.facebook.com/help/contact/6359191084165019",
    steps: [
      "Desktop link (left) opens Meta's AI data objection form directly.",
      'On mobile: Settings & Privacy → Accounts Center → "Your information and permissions."',
      'Meta generally works on a "submit an objection" model here, not a plain on/off switch.',
    ],
  },
  {
    key: "linkedin",
    name: "LinkedIn",
    sub: "profile URL",
    type: "manual",
    primary: false,
    desktopUrl: "https://www.linkedin.com/mypreferences/d/settings/data-for-ai-improvement",
    steps: [
      "The desktop link drops you straight on the right page, no hunting required.",
      'On mobile: profile photo → Settings → Data privacy → "Data for Generative AI Improvement" → toggle off.',
    ],
  },
  {
    key: "snapchat",
    name: "Snapchat",
    sub: "@handle",
    type: "manual",
    primary: false,
    desktopUrl: "https://accounts.snapchat.com/",
    steps: [
      "Open Snapchat → Bitmoji/profile icon → gear icon.",
      'Privacy Controls → "Manage My Information."',
      'Toggle off "use my Public Content to train generative AI."',
    ],
  },
  {
    key: "twitch",
    name: "Twitch",
    sub: "channel name",
    type: "manual",
    primary: false,
    desktopUrl: "https://www.twitch.tv/settings/security",
    steps: [
      "Best done from a desktop browser. Settings → Privacy, then scroll all the way down.",
      '"Training for Generative AI" sits right at the bottom of that Privacy page.',
      "Only use the mobile app? Borrow a laptop for this one specific check.",
    ],
  },
  {
    key: "x",
    name: "X (Twitter)",
    sub: "@handle",
    type: "manual",
    primary: false,
    desktopUrl: "https://x.com/settings/privacy_and_safety",
    steps: [
      "More → Settings and privacy → Privacy and safety → Data sharing and personalization.",
      'Find "Grok and third-party collaborators" → toggle off.',
    ],
  },
  {
    key: "reddit",
    name: "Reddit",
    sub: "username",
    type: "none",
    primary: false,
    note: "No opt-out provided by the platform. All your content can be used for AI training, covered under Reddit's platform-level data licensing deals.",
  },
];

const PLATFORM_MAP: Record<string, Platform> = Object.fromEntries(PLATFORMS.map((p) => [p.key, p]));

// ──────────────────────────────────────────
//  PHONE MOCKS (modal illustrations)
// ──────────────────────────────────────────
const MOCKS: Record<string, { crumb: string; hi: number; rows: string[] }> = {
  youtube: { crumb: "Studio → Settings → Channel", hi: 2, rows: ["Basic info", "Advanced settings", "Third-party training"] },
  instagram: { crumb: "Settings → Accounts Center", hi: 2, rows: ["Personal details", "Ad preferences", "AI at Meta"] },
  tiktok: { crumb: "Settings and privacy → Privacy", hi: 2, rows: ["Discoverability", "Comments", "Personalization and data"] },
  facebook: { crumb: "Accounts Center", hi: 1, rows: ["Password & security", "Your information and permissions"] },
  linkedin: { crumb: "Settings → Data privacy", hi: 2, rows: ["Visibility", "How LinkedIn uses your data", "Data for Generative AI Improvement"] },
  snapchat: { crumb: "Settings → Privacy Controls", hi: 1, rows: ["Who can contact me", "Manage My Information"] },
  twitch: { crumb: "Settings → Privacy (scroll to bottom)", hi: 2, rows: ["Whispers", "Blocked users", "Training for Generative AI"] },
  x: { crumb: "Settings → Privacy and safety", hi: 2, rows: ["Audience and tagging", "Content you see", "Grok and third-party collaborators"] },
};

const PhoneMock = ({ mock }: { mock: { crumb: string; hi: number; rows: string[] } }) => (
  <div className="mb-3.5 rounded-2xl border-[1.5px] border-[#212529] bg-white p-2.5">
    <div className="px-1 pb-2 pt-0.5 text-[10.5px] text-[#4B5563]">{mock.crumb}</div>
    {mock.rows.map((r, i) => (
      <div
        key={r}
        className={cn(
          "mb-1 flex items-center justify-between rounded-lg px-2 py-[9px] text-[12.5px]",
          i === mock.hi ? "bg-[#8134AF] font-bold text-white" : "bg-[#F2F2F2] text-[#333]",
        )}
      >
        {r}
      </div>
    ))}
  </div>
);

// ──────────────────────────────────────────
//  SHARED STYLE TOKENS (mirrors the reference stylesheet)
// ──────────────────────────────────────────
const CARD_SHADOW = "shadow-[0_2px_8px_rgba(17,17,20,.06),0_12px_32px_rgba(129,52,175,.08)]";
const CARD = `mb-[18px] rounded-3xl border border-[#F2F2F2] bg-white p-6 ${CARD_SHADOW} animate-[spFade_.3s_cubic-bezier(.4,0,.2,1)]`;
const CARD_H2 = "m-0 mb-1.5 text-[19px] font-bold tracking-[-0.3px] text-[#212529]";
const HINT = "mb-3.5 text-[13.5px] text-[#4B5563]";
// One consistent button size everywhere, exactly as in the reference.
const BTN = "cursor-pointer whitespace-normal rounded-full border-0 px-5 py-[11px] text-[13.5px] font-semibold";
const BTN_PRIMARY = `${BTN} text-white [background-image:linear-gradient(135deg,#DD2A7B_0%,#9747FF_100%)] shadow-[0_4px_14px_rgba(151,71,255,.25)] hover:brightness-105`;
const BTN_GHOST = `${BTN} border-[1.5px] border-solid border-[#D6D6D6] bg-white text-[#212529] hover:border-[#212529]`;
const INPUT =
  "min-w-0 rounded-full border border-[#e5e7eb] bg-white/90 px-4 py-2.5 text-sm text-[#212529] shadow-[0_1px_2px_rgba(0,0,0,.04)] transition-[border-color,box-shadow] duration-150 focus:border-[#9747FF] focus:outline-none focus:shadow-[0_0_0_3px_rgba(151,71,255,.18)] disabled:cursor-not-allowed";

const PILL = "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-bold";
const PILL_OK = `${PILL} border-[#bfe3d0] bg-[#e7f5ee] text-[#1f7a4d]`;
const PILL_WARN = `${PILL} border-[#FDE047] bg-[#FEF9C3] text-[#A16207]`;
const PILL_OFF = `${PILL} border-transparent bg-[#F2F2F2] text-[#5f5f5f]`;

const RING_CIRCUMFERENCE = 169.6;

type YtStatus = "secured" | "not_secured" | "unknown";
type YtCheck = { status: YtStatus; reason?: string | null; checkedVideoId?: string | null };

async function checkYouTube(handle: string): Promise<YtCheck> {
  // Wired to the Sparkonomy backend: it resolves the channel's latest upload
  // and asks YouTube's public videoTrainability API (browser CORS blocks
  // doing this client-side). Any failure degrades to "unknown", never a fake
  // positive.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/v1/creator/consent-audit/youtube?channel_id=${encodeURIComponent(handle)}`,
      { signal: controller.signal },
    );
    if (!res.ok) return { status: "unknown" };
    const data = await res.json();
    const status: YtStatus =
      data.status === "secured" || data.status === "not_secured" ? data.status : "unknown";
    return { status, reason: data.reason ?? null, checkedVideoId: data.checked_video_id ?? null };
  } catch {
    return { status: "unknown" };
  } finally {
    clearTimeout(timeoutId);
  }
}

function resolveDesktopUrl(p: Platform, handle: string): string {
  if (p.key === "youtube" && /^UC[a-zA-Z0-9_-]{10,}$/.test(handle)) {
    // Deep-links straight into the Settings modal for this channel.
    return `https://studio.youtube.com/channel/${handle}/editing/profile`;
  }
  return p.desktopUrl || "";
}

// ──────────────────────────────────────────
//  COMPONENT
// ──────────────────────────────────────────
const CreatorAIConsentAudit = () => {
  const [handles, setHandles] = useState<Record<string, string>>({});
  const [activeChipKey, setActiveChipKey] = useState<string | null>(null);
  const [ran, setRan] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [entered, setEntered] = useState<{ key: string; handle: string }[]>([]);
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [ytCheck, setYtCheck] = useState<YtCheck | null>(null);
  const [modalKey, setModalKey] = useState<string | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { submit, loading: submitLoading, error: submitError } = useCogWaitlist();

  const setHandle = (key: string, value: string) => setHandles((h) => ({ ...h, [key]: value }));

  const runAudit = async () => {
    setChecking(true);
    const list: { key: string; handle: string }[] = [];
    let yt: YtCheck | null = null;
    for (const p of PLATFORMS) {
      if (p.type === "none") continue;
      const handle = (handles[p.key] || "").trim();
      if (!handle) continue;
      if (p.type === "auto") yt = await checkYouTube(handle);
      list.push({ key: p.key, handle });
    }
    // Reddit always shown as informational if user has any handles at all
    if (list.length) list.push({ key: "reddit", handle: "" });

    setEntered(list);
    setYtCheck(yt);
    // The live verdict owns YouTube's confirm state on every run — a stale
    // "confirmed" from a previous handle's secured verdict must not survive a
    // re-run that came back unknown. The manual checkbox stays available after.
    if (yt) setConfirmed((c) => ({ ...c, youtube: yt.status === "secured" }));
    setRan(true);
    setCollapsed(true);
    setChecking(false);
  };

  const countable = entered.filter((e) => PLATFORM_MAP[e.key].type !== "none");
  const securedCount = countable.filter((e) => confirmed[e.key]).length;
  const total = countable.length;
  const pct = total === 0 ? 0 : securedCount / total;
  const scoreBig =
    total === 0
      ? "No platforms checked yet"
      : securedCount === total
        ? "All platform settings secured. Open-web protection still pending."
        : `${securedCount} of ${total} confirmed secured`;

  const submitEmail = async () => {
    const value = email.trim();
    if (!value || !value.includes("@")) {
      setEmailError("Add a valid email so we can reach you.");
      return;
    }
    setEmailError(null);
    const platforms: Record<string, string> = {};
    entered.forEach(({ key, handle }) => {
      if (handle) platforms[key] = handle;
    });
    const ok = await submit(value, platforms);
    if (ok) setSubmitted(true);
  };

  const modalPlatform = modalKey ? PLATFORM_MAP[modalKey] : null;

  return (
    <div className="caia w-full max-w-full overflow-x-hidden bg-white text-[#212529]">
      <div className="mx-auto max-w-[820px] px-5 pb-20 pt-8">
        {/* HEADER */}
        <header className="mb-7">
          <div className="caia-kicker mb-3 inline-flex items-center rounded-full bg-[#F2F2F2] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.55px] text-[#9747FF]">
            Sparkonomy · Creator Tools
          </div>
          <h1 className="m-0 mb-2.5 text-[30px] font-bold leading-[1.2] tracking-[-0.5px] text-[#212529]">
            Are you protected from AI misuse &amp; training?
          </h1>
          <p className="text-[15px] text-[#4B5563]">
            Your content can be used to train AI, or to create AI clones and digital avatars of
            you. Most creators haven&apos;t checked if they&apos;re protected. This quick and free
            audit checks your AI training opt-out settings and shows you what you can change. It
            also shows you what your platform settings don&apos;t protect on the open web.
          </p>
        </header>

        {/* STEP 1 */}
        <div className={CARD}>
          <h2 className={CARD_H2}>Step 1 · Add your handles</h2>
          {!collapsed && (
            <>
              <p className={HINT}>Run the check on all your social media handles together.</p>
              <div>
                {PLATFORMS.filter((p) => p.primary).map((p, i) => (
                  <div
                    key={p.key}
                    className={cn(
                      "flex items-center gap-3 py-3",
                      i > 0 && "border-t border-[#E5E5E5]",
                    )}
                  >
                    <div className="flex w-10 shrink-0 items-center justify-center" title={p.name}>
                      <Avatar k={p.key} />
                    </div>
                    <input
                      type="text"
                      className={`flex-1 ${INPUT}`}
                      placeholder={p.key === "youtube" ? "UC(channel ID) or @handle" : "e.g. @yourhandle"}
                      value={handles[p.key] || ""}
                      onChange={(e) => setHandle(p.key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              {/* Secondary platforms: icon-only strip. Tapping an icon opens ONE
                  shared row below the strip for that platform's handle. */}
              <div className="mt-1.5 flex flex-wrap gap-2 border-t border-[#E5E5E5] pb-1 pt-3.5">
                {PLATFORMS.filter((p) => !p.primary).map((p) => (
                  <button
                    type="button"
                    key={p.key}
                    title={p.name}
                    aria-pressed={activeChipKey === p.key}
                    onClick={() => setActiveChipKey((k) => (k === p.key ? null : p.key))}
                    className={cn(
                      "flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[10px] border border-transparent bg-transparent p-0 transition-[background-color,box-shadow] duration-150",
                      activeChipKey === p.key
                        ? "bg-[#F3E8FF] shadow-[inset_0_0_0_1.5px_#8134AF]"
                        : "hover:bg-[#F2F2F2]",
                    )}
                  >
                    <Avatar k={p.key} size={22} />
                  </button>
                ))}
              </div>
              {activeChipKey && (
                <div className="mt-2.5 border-t border-[#E5E5E5] pb-0.5 pt-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar k={activeChipKey} size={24} />
                    {PLATFORM_MAP[activeChipKey].type === "none" ? (
                      <input
                        type="text"
                        disabled
                        placeholder="Reddit offers no opt-out"
                        className={`w-full flex-1 ${INPUT}`}
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="e.g. @yourhandle"
                        className={`w-full flex-1 ${INPUT}`}
                        value={handles[activeChipKey] || ""}
                        onChange={(e) => setHandle(activeChipKey, e.target.value)}
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                      />
                    )}
                  </div>
                </div>
              )}
              <div className="mt-2 flex justify-end">
                <button type="button" className={BTN_PRIMARY} disabled={checking} onClick={runAudit}>
                  {checking ? "Checking…" : "Run my audit →"}
                </button>
              </div>
            </>
          )}
          {collapsed && (
            <div
              className="-m-1.5 flex cursor-pointer items-center gap-4 rounded-lg p-1.5 hover:bg-[#F2F2F2]"
              onClick={() => setCollapsed(false)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setCollapsed(false);
              }}
            >
              <span className="min-w-0 text-sm text-[#4B5563]">
                Audit run for {total} platform(s).
                <small className="mt-0.5 block text-xs">Tap to edit handles, or use Re-run</small>
              </span>
              <button
                type="button"
                className={`${BTN_GHOST} shrink-0`}
                disabled={checking}
                onClick={(e) => {
                  e.stopPropagation();
                  runAudit();
                }}
              >
                {checking ? "Checking…" : "Re-run audit"}
              </button>
            </div>
          )}
        </div>

        {/* STEP 2 · RESULTS */}
        {ran && (
          <div className={CARD}>
            <h2 className={CARD_H2}>Step 2 · Your results</h2>
            <div className="mb-[18px] mt-3 flex items-center gap-4 max-[520px]:flex-wrap">
              <div className="relative h-16 w-16 shrink-0">
                <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
                  <circle cx="32" cy="32" r="27" fill="none" stroke="#eee" strokeWidth="7" />
                  <circle
                    cx="32"
                    cy="32"
                    r="27"
                    fill="none"
                    stroke="#1f7a4d"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={RING_CIRCUMFERENCE - pct * RING_CIRCUMFERENCE}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-extrabold">
                  {securedCount}/{total}
                </div>
              </div>
              <div>
                <div className="text-[15px] font-bold">{scoreBig}</div>
              </div>
            </div>

            <div>
              {entered.map(({ key, handle }, i) => {
                const p = PLATFORM_MAP[key];
                const rowCls = cn(
                  "flex flex-col gap-2 py-[13px] text-sm",
                  i > 0 && "border-t border-[#E5E5E5]",
                );

                if (p.type === "none") {
                  return (
                    <div key={key} className={rowCls}>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex min-w-0 items-center gap-2.5" title={p.name}>
                          <Avatar k={key} size={28} />
                        </div>
                        <span className={PILL_OFF}>Not available</span>
                      </div>
                      <div className="text-[12.5px] text-[#4B5563]">
                        No opt-out provided by the platform. All your content can be used for AI
                        training.
                      </div>
                    </div>
                  );
                }

                const isConfirmed = !!confirmed[key];
                const ytStatus = p.type === "auto" ? ytCheck?.status : undefined;
                const desktopUrl = resolveDesktopUrl(p, handle);

                let pill: ReactNode;
                if (isConfirmed || ytStatus === "secured") {
                  pill = <span className={PILL_OK}>✓ Confirmed secured</span>;
                } else if (p.type === "auto") {
                  pill =
                    ytStatus === "not_secured" ? (
                      <span className={PILL_WARN}>Action needed</span>
                    ) : (
                      <span className={PILL_WARN}>Pending API check</span>
                    );
                } else {
                  pill = <span className={PILL_WARN}>Action needed</span>;
                }

                return (
                  <div key={key} className={rowCls}>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="flex min-w-0 items-center gap-2.5" title={p.name}>
                        <Avatar k={key} size={28} />
                        <span className="text-[13px] text-[#4B5563]">{handle}</span>
                      </div>
                      {pill}
                      <div className="ml-auto flex flex-wrap items-center gap-2">
                        {p.type === "auto" ? (
                          <button
                            type="button"
                            className={BTN_GHOST}
                            onClick={() => window.open(desktopUrl, "_blank")}
                          >
                            Open Studio
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              className={BTN_GHOST}
                              onClick={() => window.open(desktopUrl, "_blank")}
                            >
                              Open on desktop
                            </button>
                            <button
                              type="button"
                              className={BTN_GHOST}
                              onClick={() => setModalKey(key)}
                            >
                              Show me on mobile
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {p.type === "auto" && !isConfirmed && ytStatus === "unknown" && ytCheck?.reason === "handle_not_supported" && (
                      <div className="text-[12.5px] text-[#4B5563]">
                        Paste your Channel ID (it starts with UC — YouTube Studio → Settings →
                        Channel) to enable the automatic check.
                      </div>
                    )}
                    <label className="flex cursor-pointer select-none items-center gap-1.5 self-end text-right text-[12.5px] text-[#4B5563]">
                      <input
                        type="checkbox"
                        className="accent-[#1f7a4d]"
                        checked={isConfirmed}
                        onChange={(e) => setConfirmed((c) => ({ ...c, [key]: e.target.checked }))}
                      />
                      I&apos;ve confirmed this
                    </label>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-[10px] border border-[#F2F2F2] bg-[#F2F2F2] px-3.5 py-3 text-[13px] text-[#4B5563]">
              <strong>Platform settings ≠ open-web protection.</strong> Even if you turn off AI
              training on every social platform, your content can still be found elsewhere on the
              web. AI crawlers can find copies of your content and use them for AI training. You
              need open-web protection too, but it&apos;s not easy.
            </div>
          </div>
        )}

        {/* STEP 3 · CTA */}
        {ran && (
          <div className={`${CARD} [background:linear-gradient(180deg,#fff,#F3E8FF_220%)]`}>
            <h2 className="m-0 mb-1.5 text-xl font-bold leading-[1.3] tracking-[-0.3px] text-[#212529]">
              One record. Any AI can see what you allow.
            </h2>
            <div className="mb-3.5 mt-2.5 flex flex-wrap gap-2">
              {[
                "Built to EU machine-readable standard",
                "Works across every platform",
                "Yours, not the platform's",
              ].map((b) => (
                <span
                  key={b}
                  className="inline-flex rounded-full border-[1.5px] border-[rgba(151,71,255,.35)] bg-white px-3 py-1.5 text-[11.5px] font-bold text-[#9747FF] transition-[transform,box-shadow,border-color] duration-150 hover:scale-[1.07] hover:border-[#9747FF] hover:shadow-[0_0_0_3px_rgba(151,71,255,.18)]"
                >
                  {b}
                </span>
              ))}
            </div>
            <p className={HINT}>
              This record tells AI systems what they can use, and what they cannot use, when they
              find your content on the web.
            </p>
            <p className={HINT}>
              <strong>We&apos;re building this now for ourselves. Do you want one too?</strong>{" "}
              Free, because your identity is your right.
            </p>
            <div className="my-3.5 flex gap-2.5">
              <button
                type="button"
                className={`${BTN_PRIMARY} min-w-0 flex-1`}
                onClick={() => setEmailOpen(true)}
              >
                Yes, set one up for me
              </button>
              <button
                type="button"
                className={`${BTN_GHOST} min-w-0 flex-1`}
                onClick={() => setEmailOpen(false)}
              >
                Not right now
              </button>
            </div>
            {emailOpen && (
              <div className="mt-3.5">
                <input
                  type="text"
                  inputMode="email"
                  placeholder="your email address"
                  className={cn(
                    "mb-1.5 w-full",
                    INPUT,
                    emailError && "border-[#DD2A7B] focus:border-[#DD2A7B] focus:shadow-[0_0_0_3px_rgba(221,42,123,.15)]",
                  )}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitEmail();
                  }}
                  aria-invalid={!!emailError}
                />
                {emailError && (
                  <div className="mb-1.5 text-xs font-medium text-[#DD2A7B]">{emailError}</div>
                )}
                <div className="mb-2.5 text-xs text-[#4B5563]">
                  We will use this to keep you updated!
                </div>
                <button
                  type="button"
                  className={`${BTN_PRIMARY} w-full disabled:cursor-not-allowed disabled:opacity-70`}
                  disabled={submitLoading}
                  onClick={submitEmail}
                >
                  {submitLoading ? "Adding you to the list…" : "Tell me when my public record is ready"}
                </button>
                {!submitted && submitError && (
                  <div className="mt-2 text-xs font-medium text-[#DD2A7B]">
                    Something went wrong — please try again.
                  </div>
                )}
              </div>
            )}
            {submitted && (
              <div className="mt-3.5 rounded-[10px] border border-[#bfe3d0] bg-[#e7f5ee] p-3.5 text-sm text-[#1f7a4d]">
                You&apos;re on the list. We&apos;ll reach out the moment this is ready.
              </div>
            )}
          </div>
        )}

        <footer className="mt-[30px] text-center text-xs text-[#5f5f5f]">
          Sparkonomy · Helping creators stay informed and in control.
        </footer>
      </div>

      {/* MODAL */}
      {modalPlatform && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(20,20,20,.55)] p-5"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalKey(null);
          }}
        >
          <div
            className={`w-full max-w-[440px] overflow-y-auto rounded-[20px] bg-white p-[22px] ${CARD_SHADOW} max-h-[85vh] animate-[spFade_.25s_cubic-bezier(.4,0,.2,1)]`}
          >
            <h3 className="m-0 mb-1 text-lg font-bold tracking-[-0.2px] text-[#212529]">
              {modalPlatform.name}: where to find it
            </h3>
            <p className="mb-3.5 text-[12.5px] text-[#4B5563]">
              No platform links directly into this screen from their app, so here&apos;s roughly
              where it lives.
            </p>
            {MOCKS[modalPlatform.key] && <PhoneMock mock={MOCKS[modalPlatform.key]} />}
            {modalPlatform.steps?.map((s, i) => (
              <p key={i} className="m-0 mb-2.5 pl-0.5 text-[13.5px]">
                <span className="mr-2 inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#212529] text-[10.5px] font-bold text-white">
                  {i + 1}
                </span>
                {s}
              </p>
            ))}
            {modalPlatform.flag && (
              <div className="mt-1.5 rounded-lg bg-[#FEF9C3] px-2.5 py-2 text-xs text-[#A16207]">
                {modalPlatform.flag}
              </div>
            )}
            <button
              type="button"
              className={`${BTN_GHOST} mt-1.5 w-full`}
              onClick={() => setModalKey(null)}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* global: the fonts rule mirrors the reference stylesheet (Manrope on
          headings/buttons/kicker, Roboto everywhere else), and styled-jsx
          would scope-rename the keyframes used via Tailwind arbitrary
          animation classes. */}
      <style jsx global>{`
        @keyframes spFade {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .caia {
          font-family:
            var(--font-roboto-tool, Roboto),
            Roboto,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Helvetica,
            Arial,
            sans-serif;
          line-height: 1.5;
        }
        .caia h1,
        .caia h2,
        .caia h3,
        .caia button,
        .caia .caia-kicker {
          font-family:
            var(--font-manrope, Manrope),
            Manrope,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Helvetica,
            Arial,
            sans-serif;
        }
      `}</style>
    </div>
  );
};

export default CreatorAIConsentAudit;
