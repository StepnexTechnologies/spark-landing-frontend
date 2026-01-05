"use client";

import {Suspense} from "react";
import {motion} from "framer-motion";
import { useTranslation } from "react-i18next";
import AdvantageFeature from "./AdvantageFeature";
import CTAButton from "./CTAButton";

export default function AdvantageSection() {
  const { t } = useTranslation("creatorEarn");

  const advantages = [
    {
      title: t("advantage.items.0.title"),
      description: t("advantage.items.0.description"),
      iconUrl:
        "/images/creator/earn/payment-ready-illustration.png",
      hasMoneyIcon: true,
    },
    {
      title: t("advantage.items.1.title"),
      description: t("advantage.items.1.description"),
      iconUrl:
        "/images/creator/earn/tax-illustration.png",
      hasMoneyIcon: false,
    },
    {
      title: t("advantage.items.2.title"),
      description: t("advantage.items.2.description"),
      iconUrl:
        "/images/creator/earn/whatsapp-illustration.png",
      hasMoneyIcon: false,
    },
    {
      title: t("advantage.items.3.title"),
      description: t("advantage.items.3.description"),
      iconUrl:
        "/images/creator/earn/proof-of-work-illustration.png",
      hasMoneyIcon: false,
    },
  ];

  return (
    <section className="relative py-12 md:py-20 px-5 md:px-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12 space-y-4"
        >
          <h2 className="text-2xl md:text-[52px] font-bold text-white">
            {t("advantage.title")}
          </h2>
          <p className="text-base text-white max-w-[292px] md:max-w-full mx-auto">
            {t("advantage.subtitle")}
          </p>
        </motion.div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-x-[55px] md:gap-y-[49px] w-full mx-auto mb-12 md:mb-16">
          {advantages.map((advantage, index) => (
            <AdvantageFeature
              key={index}
              title={advantage.title}
              description={advantage.description}
              iconUrl={advantage.iconUrl}
              hasMoneyIcon={advantage.hasMoneyIcon}
              index={index}
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
            <CTAButton buttonText={t("advantage.cta")}/>
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
}
