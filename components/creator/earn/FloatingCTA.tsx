"use client";

import {Suspense, useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import { useTranslation } from "react-i18next";
import CTAButton from "./CTAButton";

export default function FloatingCTA() {
  const { t, ready } = useTranslation("creatorEarn");
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

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
      else if (currentScrollY < lastScrollY && currentScrollY > scrollThreshold * 0.5) {
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
          className="fixed bottom-4 left-0 right-0 z-50 flex justify-center items-center"
        >
          <Suspense fallback={null}>
            <CTAButton
              buttonText={t("floatingCta.button")}
              className="shadow-[0_8px_32px_rgba(221,42,123,0.3)]"
              hideBorderAnimation
            />
          </Suspense>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
