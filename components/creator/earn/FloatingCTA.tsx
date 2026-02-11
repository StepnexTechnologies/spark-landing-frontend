"use client";

import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { ValidatedPhoneInput } from "./ValidatedPhoneInput";

export default function FloatingCTA() {
  const { t, i18n, ready } = useTranslation("creatorEarn");
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [phone, setPhone] = useState("");

  const referralCode = searchParams.get("ref");
  const currentLang = i18n.language?.startsWith("hi") ? "hi-Latn" : "en";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = window.innerHeight * 1; // 1 viewport

      // Show button if scrolled down past threshold
      if (currentScrollY > scrollThreshold) {
        setIsVisible(true);
      }
      // Also show if scrolling up (reverse scroll) and past threshold
      else if (
        currentScrollY < lastScrollY &&
        currentScrollY > scrollThreshold * 0.5
      ) {
        setIsVisible(true);
      }
      // Hide if near the top
      else if (currentScrollY < scrollThreshold * 0.3) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const handleSignup = () => {
    const url = new URL(
      "https://beta.creator.sparkonomy.com/auth?service=earn"
    );
    url.searchParams.set("lang", currentLang);
    if (referralCode) {
      url.searchParams.set("ref", referralCode);
    }
    if (phone) {
      url.searchParams.set("phone", phone);
    }
    window.location.href = url.toString();
  };

  if (!mounted || !ready) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="fixed bottom-4 left-0 right-0 z-50 flex justify-center items-center px-4"
        >
          <div className="flex items-center w-full max-w-md rounded-full bg-white/10 backdrop-blur-[16px] backdrop-brightness-[100%] shadow-[0_8px_32px_rgba(221,42,123,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] border border-white/20 px-3 py-2 gap-2">
            <Suspense fallback={null}>
              <ValidatedPhoneInput
                id="floating-cta-phone"
                value={phone}
                onChange={setPhone}
                placeholder={t("floatingCta.placeholder")}
              />
            </Suspense>
            <button
              onClick={handleSignup}
              className="flex-shrink-0 px-5 py-2.5 rounded-full text-white text-sm font-semibold whitespace-nowrap bg-[linear-gradient(162deg,rgba(221,42,123,0.8)_0%,rgba(151,71,255,0.8)_64%)] hover:bg-[linear-gradient(162deg,rgba(221,42,123,1)_0%,rgba(151,71,255,1)_64%)] transition-all duration-200"
            >
              {t("floatingCta.signup")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
