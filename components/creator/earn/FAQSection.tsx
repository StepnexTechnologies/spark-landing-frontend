"use client";

import {Suspense, useState, useEffect} from "react";
import {motion} from "framer-motion";
import { useTranslation } from "react-i18next";
import FAQItem from "./FAQItem";
import CTAButton from "./CTAButton";

interface FAQTranslation {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const { t, ready } = useTranslation("creatorEarn");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get FAQs from translations
  const faqItems = t("faq.items", { returnObjects: true }) as FAQTranslation[];
  const faqs = Array.isArray(faqItems) ? faqItems : [];

  if (!mounted || !ready) {
    return null;
  }

  return (
    <section className="relative py-4 px-5 md:px-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[1440px] mx-auto"
      >
        <div className="w-full mx-auto">
          {/* Section Header */}
          <h2 className="text-[40px] md:text-[40px] font-bold text-white mb-6 md:mb-12">
            {t("faq.title")}
          </h2>

          {/* FAQ Items - Show only first 5 on landing page */}
          <div className="space-y-0 mb-8 md:mb-10">
            {faqs.slice(0, 5).map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                defaultOpen={index === 0}
              />
            ))}
          </div>

          {/* View All Button */}
          <div className="flex justify-center">
              <Suspense fallback={null}>
                <CTAButton buttonText={t("faq.viewAll")} navigateTo={"/creator/earn/faqs"} hideBorderAnimation/>
              </Suspense>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
