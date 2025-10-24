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
        "https://www.figma.com/api/mcp/asset/94ff5481-5d58-4790-a77b-7eb678a3ce82",
      hasMoneyIcon: true,
    },
    {
      title: "Tax‑Compliant",
      description: "GSTIN, HSN, Barters managed.",
      iconUrl:
        "https://www.figma.com/api/mcp/asset/2e477eda-b7b8-4ec0-a164-fa5efc50c164",
      hasMoneyIcon: false,
    },
    {
      title: "WhatsApp Alerts",
      description: "Your money tracked!",
      iconUrl:
        "https://www.figma.com/api/mcp/asset/db1ee620-979a-4417-8ca5-3333f4b42898",
      hasMoneyIcon: false,
    },
    {
      title: "Proof Of Work",
      description: "Auto-fetched, no more screenshots",
      iconUrl:
        "https://www.figma.com/api/mcp/asset/0aedbd9d-cd34-4325-988f-64b36cb8bd2e",
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
          <CTAButton>Get Paid Faster</CTAButton>
        </motion.div>
      </div>
    </section>
  );
}
