"use client";

import {Suspense, useState, useEffect, useRef} from "react";
import {motion} from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import AdvantageFeature from "./AdvantageFeature";
import CTAButton from "./CTAButton";
import {useSectionViewTracking} from "@/lib/hooks/useSectionViewTracking";

interface AdvantageItem {
  title: string;
  description: string;
}

interface AdvantageSectionProps {
  // "earn"  → 4-col grid of bare items (current earn design) + bottom CTA.
  // "promo" → vertical stack of card-styled rows, no CTA (promo design).
  variant?: "earn" | "promo";
  namespace?: string;
  trackingId?: string;
  analyticsEvent?: string;
}

const ADVANTAGE_ICONS = [
  "/images/creator/earn/payment-ready-illustration.png",
  "/images/creator/earn/tax-illustration.png",
  "/images/creator/earn/whatsapp-illustration.png",
  "/images/creator/earn/proof-of-work-illustration.png",
];

const PROMO_ADVANTAGE_ICONS = [
  "/promo/landing-promo/paymentReady.png",
  "/promo/landing-promo/taxCompliant.png",
  "/promo/landing-promo/Whatsapp%20Alert.png",
  "/promo/landing-promo/POW.png",
];

// Promo-variant card. Inline because the layout (rounded backgrounded row)
// differs from AdvantageFeature's bare-with-bottom-border earn layout.
function PromoAdvantageCard({ index, title, description, iconUrl }: AdvantageItem & { index: number; iconUrl: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative w-full max-w-[420px] rounded-[20px] py-3 px-2 bg-white/5 border border-white/10 backdrop-blur-md"
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0 w-[64px] h-[64px]">
          <Image src={iconUrl} alt="" fill sizes="64px" className="object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg md:text-xl leading-tight">{title}</h3>
          <p className="mt-1 text-white/75 text-sm leading-snug">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdvantageSection({
  variant = "earn",
  namespace = "creatorEarn",
  trackingId = "advantage",
  analyticsEvent = "earn_cta_click",
}: AdvantageSectionProps = {}) {
  const { t, ready } = useTranslation(namespace);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  useSectionViewTracking(sectionRef, trackingId);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !ready) {
    return null;
  }

  const isPromo = variant === "promo";

  // Earn variant ships an explicit hasMoneyIcon flag on item 0; promo variant
  // doesn't need it. Build both shapes from the namespace's i18n items.
  const rawItems = t("advantage.items", { returnObjects: true });
  const items: AdvantageItem[] = Array.isArray(rawItems) ? (rawItems as AdvantageItem[]) : [];
  const icons = isPromo ? PROMO_ADVANTAGE_ICONS : ADVANTAGE_ICONS;

  return (
    <section ref={sectionRef} className={isPromo ? "relative py-8 md:py-12 px-5 md:px-20" : "relative py-12 md:py-20 px-5 md:px-20"}>
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={isPromo ? "text-center mb-8 md:mb-10 space-y-1" : "text-center mb-8 md:mb-12 space-y-4"}
        >
          <h2 className={isPromo ? "text-3xl md:text-[44px] font-bold text-white leading-tight" : "text-2xl md:text-[52px] font-bold text-white"}>
            {t("advantage.title")}
          </h2>
          <p className={isPromo ? "text-base text-white/70 max-w-[520px] mx-auto" : "text-base text-white max-w-[292px] md:max-w-full mx-auto"}>
            {t("advantage.subtitle")}
          </p>
        </motion.div>

        {isPromo ? (
          <div className="flex flex-col items-center gap-4 md:gap-5 max-w-[480px] mx-auto">
            {items.map((item, i) => (
              <PromoAdvantageCard
                key={i}
                index={i}
                title={item.title}
                description={item.description}
                iconUrl={icons[i] ?? icons[0]}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-x-[55px] md:gap-y-[49px] w-full mx-auto mb-12 md:mb-16">
              {items.map((item, i) => (
                <AdvantageFeature
                  key={i}
                  title={item.title}
                  description={item.description}
                  iconUrl={icons[i] ?? icons[0]}
                  hasMoneyIcon={i === 0}
                  index={i}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <Suspense fallback={null}>
                <CTAButton buttonText={t("advantage.cta")} analyticsEvent={analyticsEvent}/>
              </Suspense>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
