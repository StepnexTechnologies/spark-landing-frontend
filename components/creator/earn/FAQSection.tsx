"use client";

import {motion} from "framer-motion";
import FAQItem from "./FAQItem";
import CTAButton from "./CTAButton";
import {getHomepageFAQs} from "@/data/faqs";

export default function FAQSection() {
  // Get first 6 FAQs for homepage, first one open by default
  const faqs = getHomepageFAQs(6);

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
            Frequently Asked Questions
          </h2>

          {/* FAQ Items */}
          <div className="space-y-0 mb-8 md:mb-10">
            {faqs.map((faq, index) => (
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
              <CTAButton buttonText={"View All"} navigateTo={"/creator/earn/faqs"}/>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
