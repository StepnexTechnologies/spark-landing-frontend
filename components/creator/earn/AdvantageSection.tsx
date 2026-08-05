"use client";

import {Suspense, useRef} from "react";
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
  "/promo/landing-promo/Proofofwork.png",
  "/promo/landing-promo/Hamesha4invoices.png",
  "/promo/landing-promo/Taxcalculations.png",
  "/promo/landing-promo/CA-ready.png",
];

// Renders a comma-headline ("Hamesha free, 4 invoices.") as two balanced lines
// on laptop/desktop — breaking right after the first comma — while keeping it
// inline (natural wrap) on mobile. Titles without a comma render unchanged.
function TitleWithLaptopBreak({ title }: { title: string }) {
  const commaIdx = title.indexOf(",");
  if (commaIdx === -1 || commaIdx >= title.trimEnd().length - 1) {
    return <>{title}</>;
  }
  const first = title.slice(0, commaIdx + 1); // keep the comma on line 1
  const rest = title.slice(commaIdx + 1).trimStart();
  return (
    <>
      {first}{" "}
      {/* md+ only: forces the break after the comma. Hidden on mobile, where
          the trailing space above keeps the headline a single inline run. */}
      <br className="hidden md:block" />
      {rest}
    </>
  );
}

// Promo-variant card. Inline because the layout (rounded backgrounded row)
// differs from AdvantageFeature's bare-with-bottom-border earn layout.
function PromoAdvantageCard({ index, title, description, iconUrl }: AdvantageItem & { index: number; iconUrl: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative w-full max-w-[420px] rounded-[20px] py-3 px-2 bg-white/5 border border-white/10 backdrop-blur-md md:max-w-none md:rounded-none md:bg-transparent md:border-0 md:border-b md:border-white/20 md:backdrop-blur-0 md:px-0 md:py-0 md:pb-3"
    >
      <div className="flex items-start gap-2 md:flex-col md:items-center md:gap-3.5 md:text-center">
        <div className="relative shrink-0 w-[64px] h-[64px] md:w-[65px] md:h-[79px]">
          <Image src={iconUrl} alt="" fill sizes="79px" className="object-contain" />
        </div>
        <div className="flex-1 min-w-0 md:flex-none md:flex md:flex-col md:items-center md:gap-3.5 md:max-w-[247px]">
          <h3 className="text-white font-bold text-lg md:text-2xl md:font-semibold leading-tight md:leading-normal"><TitleWithLaptopBreak title={title} /></h3>
          <p className="mt-1 md:mt-0 text-white text-sm leading-snug md:text-center">{description}</p>
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
  const { t } = useTranslation(namespace);
  const sectionRef = useRef<HTMLElement>(null);
  useSectionViewTracking(sectionRef, trackingId);

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
          {t("advantage.subtitle", { defaultValue: "" }) && (
            <p className={isPromo ? "text-base text-white/70 max-w-[520px] mx-auto" : "text-base text-white max-w-[292px] md:max-w-full mx-auto"}>
              {t("advantage.subtitle")}
            </p>
          )}
        </motion.div>

        {isPromo ? (
          <div className="flex flex-col items-center gap-4 max-w-[480px] mx-auto md:max-w-none md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-x-[55px] md:gap-y-[49px] md:items-stretch">
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
