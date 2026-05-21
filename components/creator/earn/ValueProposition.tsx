"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSectionViewTracking } from "@/lib/hooks/useSectionViewTracking";

export default function ValueProposition() {
  const { t } = useTranslation("creatorEarn");
  const sectionRef = useRef<HTMLElement>(null);
  useSectionViewTracking(sectionRef, "earn_pitch");

  return (
    <section
      ref={sectionRef}
      className="relative pt-2 pb-10 md:pt-4 md:pb-16 px-5 md:px-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="max-w-[760px] mx-auto text-center space-y-4 md:space-y-6"
      >
        <h2 className="text-[32px] md:text-[44px] font-bold text-white leading-tight">
          {(() => {
            const [before, after] = t("pitch.heading").split(" — ");
            return after === undefined ? (
              before
            ) : (
              <>
                {before}
                <br />
                {after}
              </>
            );
          })()}
        </h2>
        <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-[640px] mx-auto">
          {t("pitch.description")}
        </p>
      </motion.div>
    </section>
  );
}
