"use client";

import {motion} from "framer-motion";
import AdvantageFeature from "./AdvantageFeature";
import CTAButton from "./CTAButton";

export default function AdvantageSection() {
  const advantages = [
    {
      title: "Payment Ready",
      description: "GST auto‑calculated, payment integrated",
      iconUrl:
        "/images/creator/earn/payment-ready-illustration.png",
      hasMoneyIcon: true,
    },
    {
      title: "Tax‑Compliant",
      description: "GSTIN, HSN, Barters managed.",
      iconUrl:
        "/images/creator/earn/tax-illustration.png",
      hasMoneyIcon: false,
    },
    {
      title: "WhatsApp Alerts",
      description: "Your money tracked!",
      iconUrl:
        "/images/creator/earn/whatsapp-illustration.png",
      hasMoneyIcon: false,
    },
    {
      title: "Proof Of Work",
      description: "Auto-fetched, no more screenshots",
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
            Your Advantage
          </h2>
          <p className="text-base text-white max-w-[292px] md:max-w-full mx-auto">
            Invoices that get you paid faster, and make you look good!
          </p>
        </motion.div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-[55px] md:gap-y-[49px] max-w-[358px] md:max-w-[1162px] mx-auto mb-12 md:mb-16">
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
          <CTAButton buttonText={"Get Paid Faster"}/>
        </motion.div>
      </div>
    </section>
  );
}
