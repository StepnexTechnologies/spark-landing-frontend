"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { track } from "@/lib/analytics/track";
import { appendUtmTo, readUtmParams } from "@/lib/utm";

interface CTAButtonProps {
    buttonText?: string;
    className?: string;
    navigateTo?: string;
    hideBorderAnimation?: boolean;
    // Analytics event name. Defaults to "earn_cta_click"; pass "promo_cta_click"
    // (or anything else) when reusing this button on a different funnel.
    analyticsEvent?: string;
}

const CTAButton = ({buttonText = "Send Invoices For Free", className, navigateTo = "https://beta.creator.sparkonomy.com/auth?service=earn", hideBorderAnimation = false, analyticsEvent = "earn_cta_click"}: CTAButtonProps) => {
    const searchParams = useSearchParams();
    const { i18n } = useTranslation();
    const referralCode = searchParams.get("ref");

    // Defer reading i18n.language and window.location until after hydration
    // so SSR and first client render emit identical href. Without this gate,
    // SSR uses the fallback ('en') while the client may have already detected
    // 'hi-Latn' via LanguageDetector, producing a hydration mismatch.
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => setHydrated(true), []);

    const buildUrl = () => {
        const base = hydrated && typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const url = new URL(navigateTo, base);
        const currentLang = hydrated && i18n.language?.startsWith('hi') ? 'hi-Latn' : 'en';
        url.searchParams.set('lang', currentLang);
        if (referralCode) {
            url.searchParams.set('ref', referralCode);
        }
        // Forward UTM labels so creator-frontend's AuthScreen can stash them
        // in localStorage and attach to /auth/verify. Gated on hydration —
        // readUtmParams touches sessionStorage which isn't available on the
        // server. The URLSearchParams wrapper around searchParams normalises
        // the Next.js ReadonlyURLSearchParams to the standard interface.
        if (hydrated) {
            appendUtmTo(url, readUtmParams(new URLSearchParams(searchParams.toString())));
        }
        // Return relative path for internal URLs, full URL for external
        if (url.origin === base && !navigateTo.startsWith('http')) {
            return url.pathname + url.search;
        }
        return url.toString();
    };

    const finalUrl = buildUrl();

    return (
        <Link
            className={`all-[unset] box-border inline-flex items-start p-[1px] relative flex-col rounded-[32px] gap-2.5 border-[none] overflow-hidden ${className}`}
            href={finalUrl}
            onClick={() => track(analyticsEvent, { cta: "beta_signup", label: buttonText, referral_code: referralCode ?? null })}
        >
            {!hideBorderAnimation && <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,rgba(221,42,123,1)_10%,rgba(151,71,255,1)_50%,rgba(221,42,123,0.5)_90%,#ffffff_100%)]" />}
            <div
                className={`all-[unset] box-border items-center gap-2.5 flex-[0_0_auto] px-4 py-2.5 rounded-[32px] justify-center relative inline-flex shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] z-10 bg-[#ffffff1a] [-webkit-backdrop-filter:blur(16px)_brightness(100%)] backdrop-blur-[16px] backdrop-brightness-[100%]`}
            >
                <div
                    className="absolute inset-0 rounded-[32px] bg-[linear-gradient(162deg,rgba(221,42,123,0.4)_0%,rgba(151,71,255,0.4)_64%)] pointer-events-none"
                />
                <div className="font-title w-fit mt-[-1.00px] tracking-[var(--title-letter-spacing)] text-[length:var(--title-font-size)] [font-style:var(--title-font-style)] text-white font-[number:var(--title-font-weight)] leading-[var(--title-line-height)] whitespace-nowrap relative z-10">
                    {buttonText}
                </div>
            </div>
        </Link>
    );
};

export default CTAButton;