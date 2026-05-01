"use client";

import {motion} from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";

export default function EarnFooter() {
  const { t } = useTranslation("creatorEarn");

  return (
    <footer className="relative py-8 md:py-12 px-5 md:px-20 mb-36">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-[1440px] mx-auto"
      >
        <div className="max-w-[392px] md:max-w-[1058px] mx-auto space-y-4">
          {/* Divider Line */}
          <div className="w-full h-[1px] bg-white/20" />

          {/* Logo and Tagline */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative h-9 w-[196px]">
              <Image
                src="/sparkonomy_full.png"
                alt="Sparkonomy Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-[#999999] text-lg leading-[1.4] text-center">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col items-center gap-1 text-gray-500 text-xs">
            <div className="flex items-center justify-center gap-1">
              <Link href="/legal/terms" className="hover:text-white transition-colors">
                {t("footer.terms")}
              </Link>
              <span>|</span>
              <Link href="/legal/privacy-policy" className="hover:text-white transition-colors">
                {t("footer.privacy")}
              </Link>
              <span>|</span>
              <Link href="/legal/refund-policy" className="hover:text-white transition-colors">
                {t("footer.refund")}
              </Link>
            </div>
            <span>{t("footer.copyright")}</span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
