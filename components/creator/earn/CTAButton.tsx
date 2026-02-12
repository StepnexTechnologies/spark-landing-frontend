"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

interface CTAButtonProps {
    buttonText?: string;
    className?: string;
    navigateTo?: string;
    hideBorderAnimation?: boolean;
}

const CTAButton = ({buttonText = "Send Invoices For Free", className, navigateTo = "https://beta.creator.sparkonomy.com/auth?service=earn", hideBorderAnimation = false}: CTAButtonProps) => {
    const searchParams = useSearchParams();
    const { i18n } = useTranslation();
    const referralCode = searchParams.get("ref");
    const currentLang = i18n.language?.startsWith('hi') ? 'hi-Latn' : 'en';

    // Build URL with language and optional referral code
    const buildUrl = () => {
        // Use window.location.origin as base for relative URLs
        const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const url = new URL(navigateTo, base);
        url.searchParams.set('lang', currentLang);
        if (referralCode) {
            url.searchParams.set('ref', referralCode);
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