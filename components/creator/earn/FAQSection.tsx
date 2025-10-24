"use client";

import {motion} from "framer-motion";
import FAQItem from "./FAQItem";
import CTAButton from "./CTAButton";

export default function FAQSection() {
  const faqs = [
    {
      question: "Q1: How much will RTCT cost after the private beta?",
      answer:
        "We are still finalizing the pricing structure. As a thank you for being a beta partner, you will receive an exclusive, significant discount when we launch publicly. For now, access is completely free with no commitment required.",
      defaultOpen: true,
    },
    {
      question: "Q2: Is this difficult to set up? Do I need a developer?",
      answer:
        "Absolutely not. RTCT is designed for marketers, by marketers. You can set up a complete campaign tracker in under 100 seconds without writing a single line of code. If you can write an email, you can launch a tracker.",
      defaultOpen: false,
    },
    {
      question: "Q3: What social media platforms does the tracker support?",
      answer:
        "During this private beta, RTCT will actively track Instagram (Reels, Stories, Feed Posts) and YouTube. We're already working to expand support for other platforms based on feedback from partners like you. For the richest insights, we securely request view access to your creators' accounts, always respecting privacy and platform guidelines. We encourage you to give your creators a heads-up; it ensures the most accurate data and truly empowers your campaigns.",
      defaultOpen: false,
    },
    {
      question:
        "Q4: How often is the data refreshed, and how do Smart Alerts work?",
      defaultOpen: false,
    },
    {
      question: "Q5: How is my campaign data kept secure and confidential?",
      defaultOpen: false,
    },
    {
      question:
        "Q6: What happens after the private beta? Do I lose my data or access?",
      defaultOpen: false,
    },
  ];

  return (
    <section className="relative py-12 md:py-20 px-5 md:px-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[1440px] mx-auto"
      >
        <div className="max-w-[349px] md:max-w-[1060px] mx-auto">
          {/* Section Header */}
          <h2 className="text-[40px] md:text-[40px] font-bold text-white mb-6 md:mb-12">
            Frequently Asked Questions
          </h2>

          {/* FAQ Items */}
          <div className="space-y-0 mb-8 md:mb-10">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                defaultOpen={faq.defaultOpen}
              />
            ))}
          </div>

          {/* View All Button */}
          <div className="flex justify-center md:justify-start">
            <CTAButton>View All</CTAButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
