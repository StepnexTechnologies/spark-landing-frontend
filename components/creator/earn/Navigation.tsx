"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CTAButton from "./CTAButton";

interface NavigationProps {
  showLanguageSwitcher?: boolean;
  showCTA?: boolean;
  namespace?: string;
}

export default function Navigation({
  showLanguageSwitcher = true,
  showCTA = true,
  namespace = "creatorEarn",
}: NavigationProps = {}) {
  const { t } = useTranslation(namespace);

  // No fade-in: the nav (logo + CTA) is part of the LCP region on the
  // promo page, so it must paint on the first SSR frame instead of waiting
  // ~600ms for a framer transition.
  return (
    <nav className="sticky top-0 left-0 right-0 z-50 px-5 md:px-20 py-3 md:py-8">
      <div className="flex items-center justify-between max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link className="relative h-6 w-[130px] md:h-10 md:w-[218px]" href={"/creator/earn"}>
          <Image
            src={"/sparkonomy_full_white.png"}
            alt="Sparkonomy Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>
        <div className="flex items-center gap-3">
          {showLanguageSwitcher && <LanguageSwitcher />}
          {/* Hidden on mobile, visible on md and above */}
          {showCTA && (
            <Suspense fallback={<div className="h-10" />}>
              <div className="hidden md:block">
                <CTAButton buttonText={t("nav.getEarlyAccess")} />
              </div>
            </Suspense>
          )}
        </div>
      </div>
    </nav>
  );
}
