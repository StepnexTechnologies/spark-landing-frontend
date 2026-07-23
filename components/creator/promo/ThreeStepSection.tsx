"use client";

import {useRef, type ReactNode} from "react";
import { m } from "framer-motion";
import Image from "next/image";
import { Trans, useTranslation } from "react-i18next";
import {useSectionViewTracking} from "@/lib/hooks/useSectionViewTracking";

interface ThreeStepItem {
  title: string;
  description: string;
  tags: string[];
}

const STEP_IMAGES = [
  "/promo/landing-promo/Step-1.png",
  "/promo/landing-promo/Step-2.png",
  "/promo/landing-promo/Step-3.png",
];

function StepCard({ index, title, description, tags, imageUrl }: Omit<ThreeStepItem, "description"> & { description: ReactNode; index: number; imageUrl: string }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative w-full max-w-[420px] rounded-[24px] px-2 py-3 md:p-5 bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
    >
      <div className="flex items-center gap-2">
        {/* Phone illustration */}
        <div className="relative shrink-0 w-16 h-[63px]">
          <Image src={imageUrl} alt="" fill sizes="64px" className="object-contain" />
        </div>

        {/* Title + description + tags */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg md:text-xl leading-tight tracking-[-0.04em]">{title}</h3>
          <p className="mt-1.5 text-white text-sm leading-[150%]">{description}</p>

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-[6px] py-1 rounded-full text-white text-xs font-medium"
                  style={{
                    background:
                      "linear-gradient(322.94deg, rgba(221, 42, 123, 0.3) -4.16%, rgba(151, 71, 255, 0.3) 48.14%, rgba(51, 76, 202, 0.3) 122.6%)",
                    border: "0.5px solid rgba(255, 255, 255, 0.4)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </m.div>
  );
}

interface ThreeStepSectionProps {
  namespace?: string;
  trackingId?: string;
}

export default function BenefitsSection({
  namespace = "creatorPromo",
  trackingId = "promo_three_step",
}: ThreeStepSectionProps = {}) {
  const { t } = useTranslation(namespace);
  const sectionRef = useRef<HTMLElement>(null);
  useSectionViewTracking(sectionRef, trackingId);

  const rawItems = t("threeStep.items", { returnObjects: true });
  const steps: ThreeStepItem[] = Array.isArray(rawItems) ? (rawItems as ThreeStepItem[]) : [];

  return (
    <section ref={sectionRef} className="relative pb-5 md:pb-12 px-5 md:px-20">
      <div className="max-w-[1200px] mx-auto">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-10 space-y-2"
        >
          <h2 className="text-3xl md:text-[44px] font-bold text-white leading-tight">
            {t("threeStep.title")}
          </h2>
          <p className="text-sm md:text-base text-white/70 max-w-[520px] mx-auto">
            {t("threeStep.subtitle")}
          </p>
        </m.div>

        <div className="flex flex-col items-center lg:flex-row lg:items-stretch lg:justify-center gap-4 md:gap-6">
          {steps.map((step, i) => (
            <StepCard
              key={i}
              index={i}
              title={step.title}
              description={<Trans t={t} i18nKey={`threeStep.items.${i}.description`} />}
              tags={Array.isArray(step.tags) ? step.tags : []}
              imageUrl={STEP_IMAGES[i] ?? STEP_IMAGES[0]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
