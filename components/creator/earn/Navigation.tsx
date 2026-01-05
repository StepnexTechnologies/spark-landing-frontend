"use client";

import {Suspense} from "react";
import {motion} from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import CTAButton from "./CTAButton";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navigation() {
  const { t } = useTranslation("creatorEarn");

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 left-0 right-0 z-50 px-5 md:px-20 py-3 md:py-8"
    >
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
          <LanguageSwitcher />
          <Suspense fallback={<div className="h-10" />}>
            <CTAButton buttonText={t("nav.getEarlyAccess")} />
          </Suspense>
        </div>
      </div>
    </motion.nav>
  );
}
