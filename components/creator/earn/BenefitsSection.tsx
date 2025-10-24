"use client";

import {motion} from "framer-motion";
import BenefitCard from "./BenefitCard";
import CTAButton from "./CTAButton";

export default function BenefitsSection() {
  const benefits = [
    {
      title: "Send a Chat. Get an Invoice.",
      description: `Upload a WhatsApp message, email, or PO — or just type "Make me an invoice for…" and our AI does the rest. Perfect pro formatting, GST/PAN handled, no typos, no approval tension. <span class="font-bold italic">You create content, we create cash flow.</span>`,
      imageUrl:
        "https://www.figma.com/api/mcp/asset/0cfd3ffa-9810-43b1-b26c-ec6326cee9c1",
      decorativeImages: [
        {
          url: "https://www.figma.com/api/mcp/asset/62731bed-e879-4fc2-9ffd-5d48e693cd47",
          className: "absolute top-[100px] right-[77px] w-[46px] h-[34px]",
        },
        {
          url: "https://www.figma.com/api/mcp/asset/0a8940d1-0e33-4344-bda1-9ec378109372",
          className: "absolute top-[55px] left-[58px] w-[34px] h-[37px]",
        },
        {
          url: "https://www.figma.com/api/mcp/asset/09f29977-afb6-4245-ac2d-120af0605530",
          className: "absolute bottom-[35px] left-[104px] w-[26px] h-[28px]",
        },
      ],
    },
    {
      title: "You Create. We Chase.",
      description: `No more painful "Hey, just checking on the payment?" reminder follow-ups. Our AI sends polite, friendly payment reminders so you don't have to. <span class="font-bold italic">You build relationships; we get payments.</span>`,
      imageUrl:
        "https://www.figma.com/api/mcp/asset/da9a6152-3732-4b56-b8ae-c5e8fab23385",
      decorativeImages: [],
    },
    {
      title: "Go Pro. With your Pocket Money Manager/CFO.",
      description: `Get weekly, 5-minute updates of your cash flow, overdue payments, and income growth. We keep your records organised and help your business stay tax compliant. <span class="font-bold italic">You go Pro, we get you there.</span>`,
      imageUrl:
        "https://www.figma.com/api/mcp/asset/93c9c051-d7dc-472d-af00-51b0f59fc8fe",
      decorativeImages: [],
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
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-[52px] font-bold text-white">
            Benefits
          </h2>
        </motion.div>

        {/* Benefits Cards */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start justify-center mb-12 md:mb-16">
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
          <CTAButton>Don&apos;t Wait, Try For Free</CTAButton>
        </motion.div>
      </div>
    </section>
  );
}
