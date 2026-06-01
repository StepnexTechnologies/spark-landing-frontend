"use client";

import {Suspense, useRef, useState} from "react";
import {motion} from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import FAQItem from "./FAQItem";
import CTAButton from "./CTAButton";
import {useSectionViewTracking} from "@/lib/hooks/useSectionViewTracking";
import {track} from "@/lib/analytics/track";

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
  // When true, "View All" expands the remaining FAQs inline instead of
  // navigating away. Used by the promo page where the dedicated FAQs route
  // (creatorEarn namespace) doesn't share the promo content.
  expandInline?: boolean;
}

export default function FAQSection({
  namespace = "creatorEarn",
  viewAllHref = "/creator/earn/faqs",
  trackingId = "faq",
  analyticsEvent = "earn_cta_click",
  expandInline = false,
}: FAQSectionProps = {}) {
  const { t } = useTranslation(namespace);
  const sectionRef = useRef<HTMLElement>(null);
  useSectionViewTracking(sectionRef, trackingId);

  const [showAll, setShowAll] = useState(false);

  // Get FAQs from translations
  const faqItems = t("faq.items", { returnObjects: true }) as FAQTranslation[];
  const faqs = Array.isArray(faqItems) ? faqItems : [];

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 5);
  const hasMore = faqs.length > 5;

  const handleToggle = () => {
    const next = !showAll;
    track(analyticsEvent, {
      section: trackingId,
      action: next ? "view_all" : "view_less",
    });
    setShowAll(next);
  };

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
          <div className="flex items-center justify-center gap-6 mb-10">
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
          <h2 className="text-[40px] md:text-[40px] font-bold text-white leading-none md:leading-tight mb-1 md:mb-12">
            {t("faq.title")}
          </h2>

          {/* FAQ Items */}
          <div className="space-y-0 mb-4 md:mb-6">
            {visibleFaqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                defaultOpen={index === 0}
              />
            ))}
          </div>

          {/* View All — inline-expand variant renders a right-aligned text
              link (matches promo design); legacy variant navigates to the
              creatorEarn FAQs page. */}
          {expandInline ? (
            hasMore && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleToggle}
                  className="text-white text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  {showAll ? t("faq.viewLess") : t("faq.viewAll")}
                </button>
              </div>
            )
          ) : (
            <div className="flex justify-center mt-4 md:mt-6">
              <Suspense fallback={null}>
                <CTAButton buttonText={t("faq.viewAll")} navigateTo={viewAllHref} hideBorderAnimation analyticsEvent={analyticsEvent}/>
              </Suspense>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
