"use client";

import {motion} from "framer-motion";
import BenefitCard from "./BenefitCard";
import CTAButton from "./CTAButton";

export default function BenefitsSection() {
  const benefits = [
    {
      title: "Send a Chat. Get an Invoice.",
      description: `Upload a WhatsApp message, email, or PO — or just type "Make me an invoice for…" and our AI does the rest. Perfect pro formatting, GST/PAN handled, no typos, no approval tension. <span class="font-bold italic">You create content, we create cash flow.</span>`,
      imageUrl: "/images/creator/earn/benefit-1.png",
      decorativeImages: [],
    },
    {
      title: "You Create. We Chase.",
      description: `No more painful "Hey, just checking on the payment?" reminder follow-ups. Our AI sends polite, friendly payment reminders so you don't have to. <span class="font-bold italic">You build relationships; we get payments.</span>`,
      imageUrl: "/images/creator/earn/benefit-2.png",
      decorativeImages: [],
    },
    {
      title: "Go Pro. With your Pocket CFO.",
      description: `Get weekly, 5-minute updates of your cash flow, overdue payments, and income growth. We keep your records organised and help your business stay tax compliant. <span class="font-bold italic">You go Pro, we get you there.</span>`,
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
            Benefits
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
            <CTAButton buttonText={"Don't Wait Try For Free"}/>
        </motion.div>
      </div>
    </section>
  );
}
