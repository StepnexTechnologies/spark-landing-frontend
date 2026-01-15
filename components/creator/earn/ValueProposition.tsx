"use client";

import {Suspense, useState, useEffect} from "react";
import {motion} from "framer-motion";
import { useTranslation } from "react-i18next";
import CTAButton from "./CTAButton";

export default function ValueProposition() {
  const { t, ready } = useTranslation("creatorEarn");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !ready) {
    return null;
  }

  return (
    <section className="relative py-12 md:py-20 px-5 md:px-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-[1440px] mx-auto text-center"
      >
        <div className="max-w-[321px] md:max-w-[931px] mx-auto space-y-6 md:space-y-8">
          {/* Main Heading */}
          <h2 className="text-[40px] md:text-[52px] font-bold text-white leading-tight">
            <span className="block">{t("valueProposition.heading1")}</span>
            <span className="block">{t("valueProposition.heading2")}</span>
          </h2>

          {/* Description */}
          <p className="text-base md:text-base text-white leading-normal max-w-[321px] md:max-w-full mx-auto">
            {t("valueProposition.description")}
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
              <Suspense fallback={null}>
                <CTAButton buttonText={t("valueProposition.cta")}/>
              </Suspense>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
