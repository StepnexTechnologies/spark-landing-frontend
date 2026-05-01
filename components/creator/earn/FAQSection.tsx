"use client";

import {Suspense, useState, useEffect, useRef} from "react";
import {motion} from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import FAQItem from "./FAQItem";
import CTAButton from "./CTAButton";
import {useSectionViewTracking} from "@/lib/hooks/useSectionViewTracking";

interface FAQTranslation {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  namespace?: string;
  viewAllHref?: string;
  // Tracking ID passed to useSectionViewTracking. Defaults to "faq"; pass a
  // different label (e.g. "promo_faq") when reusing the section so impression
  // tracking is attributable per funnel.
  trackingId?: string;
  // Analytics event for the View All button (forwarded to CTAButton).
  analyticsEvent?: string;
}

export default function FAQSection({
  namespace = "creatorEarn",
  viewAllHref = "/creator/earn/faqs",
  trackingId = "faq",
  analyticsEvent = "earn_cta_click",
}: FAQSectionProps = {}) {
  const { t, ready } = useTranslation(namespace);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  useSectionViewTracking(sectionRef, trackingId);

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
    <section ref={sectionRef} className="relative py-4 px-5 md:px-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[1440px] mx-auto"
      >
        <div className="w-full mx-auto">
          {/* Compliance Badges */}
          <div className="flex items-center justify-center gap-6 mb-12">
            <Image
              src="/logos/GDPR_White.png"
              alt="GDPR"
              height={64}
              width={64}
              className="h-[64px] w-[64px] object-contain"
            />
            <Image
              src="/logos/CCPA_White.png"
              alt="CCPA"
              height={64}
              width={64}
              className="h-[64px] w-[64px] object-contain"
            />
            <Image
              src="/logos/DPDP_White.png"
              alt="DPDP"
              height={64}
              width={64}
              className="h-[64px] w-[64px] object-contain"
            />
          </div>

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
                <CTAButton buttonText={t("faq.viewAll")} navigateTo={viewAllHref} hideBorderAnimation analyticsEvent={analyticsEvent}/>
              </Suspense>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
