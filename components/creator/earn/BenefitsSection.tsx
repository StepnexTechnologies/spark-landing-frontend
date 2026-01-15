"use client";

import {Suspense, useState, useEffect} from "react";
import {motion} from "framer-motion";
import { useTranslation } from "react-i18next";
import BenefitCard from "./BenefitCard";
import CTAButton from "./CTAButton";

export default function BenefitsSection() {
  const { t, ready } = useTranslation("creatorEarn");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !ready) {
    return null;
  }

  const benefits = [
    {
      title: t("benefits.items.0.title"),
      description: `${t("benefits.items.0.description")} <span class="font-bold italic">${t("benefits.items.0.highlight")}</span>`,
      imageUrl: "/images/creator/earn/benefit-1.png",
      decorativeImages: [],
    },
    {
      title: t("benefits.items.1.title"),
      description: `${t("benefits.items.1.description")} <span class="font-bold italic">${t("benefits.items.1.highlight")}</span>`,
      imageUrl: "/images/creator/earn/benefit-2.png",
      decorativeImages: [],
    },
    {
      title: t("benefits.items.2.title"),
      description: `${t("benefits.items.2.description")} <span class="font-bold italic">${t("benefits.items.2.highlight")}</span>`,
      imageUrl: "/images/creator/earn/benefit-3.png",
      decorativeImages: [],
    },
  ];

  return (
    <section className="relative py-4 px-5 md:px-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-[52px] font-bold text-white">
            {t("benefits.title")}
          </h2>
        </motion.div>

        {/* Benefits Cards */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8 items-center lg:items-start justify-center mb-12 md:mb-16">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              title={benefit.title}
              description={benefit.description}
              imageUrl={benefit.imageUrl}
              decorativeImages={benefit.decorativeImages}
            />
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
            <Suspense fallback={null}>
              <CTAButton buttonText={t("benefits.cta")}/>
            </Suspense>
        </motion.div>
      </div>
    </section>
  );
}
