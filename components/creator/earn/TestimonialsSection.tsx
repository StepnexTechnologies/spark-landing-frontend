"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel, { UseEmblaCarouselType } from "embla-carousel-react";
import { useTranslation } from "react-i18next";
import TestimonialCard from "./TestimonialCard";
import styles from "./carousel.module.css";
import { m } from "framer-motion";
import { useSectionViewTracking } from "@/lib/hooks/useSectionViewTracking";

interface TestimonialsSectionProps {
  namespace?: string;
  trackingId?: string;
  // When true, the carousel's per-slide fade-in is disabled. Use on funnels
  // where the section sits above the fold on initial load — whileInView
  // misfires for off-center carousel slides because their visible peek is
  // smaller than the trigger margin, leaving them stuck at opacity 0 until
  // the user interacts. Defaults to false so the existing earn page is unchanged.
  disableSlideEntryAnimation?: boolean;
}

export default function TestimonialsSection({
  namespace = "creatorEarn",
  trackingId = "testimonials",
  disableSlideEntryAnimation = false,
}: TestimonialsSectionProps = {}) {
  const { t } = useTranslation(namespace);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0); // Start with 1st card
  const sectionRef = useRef<HTMLElement>(null);
  useSectionViewTracking(sectionRef, trackingId);

  // Subtitle is optional — promo namespace defines `testimonials.subtitle`,
  // earn doesn't. `defaultValue: ""` makes a missing key render empty rather
  // than echoing the key string back.
  const subtitle = t("testimonials.subtitle", { defaultValue: "" });

  const testimonials = useMemo(
    () => [
      {
        quote: t("testimonials.items.0.quote"),
        name: t("testimonials.items.0.name"),
        handle: t("testimonials.items.0.handle"),
        avatarUrl: "/images/creator/earn/testimonial-1.png",
        highlighted: false,
      },
      {
        quote: t("testimonials.items.1.quote"),
        name: t("testimonials.items.1.name"),
        handle: t("testimonials.items.1.handle"),
        avatarUrl: "/images/creator/earn/testimonial-2.png",
        highlighted: false,
      },
      {
        quote: t("testimonials.items.2.quote"),
        name: t("testimonials.items.2.name"),
        handle: t("testimonials.items.2.handle"),
        avatarUrl: "/images/creator/earn/testimonial-3.png",
        highlighted: false,
      },
    ],
    [t]
  );

  const emblaOptions = useMemo(
    () => ({
      align: "center" as const, // ensures centered active card
      // `trimSnaps` would clip the first/last slides flush to the viewport edge
      // and prevent them from centering. Disable containment so every snap
      // lands in the middle.
      containScroll: false as const,
      loop: false,
      draggable: true,
      skipSnaps: false,
    }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);

  const onSelect = useCallback((embla?: UseEmblaCarouselType[1]) => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
  }, []);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  // track window width client-side (SSR-safe)
  useEffect(() => {
    const setWidth = () => setWindowWidth(window.innerWidth);
    setWidth();
    window.addEventListener("resize", setWidth);
    return () => window.removeEventListener("resize", setWidth);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", () => onSelect(emblaApi));
    emblaApi.on("reInit", () => onSelect(emblaApi));
    // Scroll to 1st card (index 0) on init
    emblaApi.scrollTo(0, true); // true = instant, no animation
  }, [emblaApi, onSelect]);

  // only active for tablet and phone
  const isCarouselActive = windowWidth > 0 && windowWidth < 1024; // Tailwind `lg`

  const snaps = emblaApi ? emblaApi.scrollSnapList() : testimonials.map((_, i) => i);

  return (
    <section ref={sectionRef} className="relative py-4 md:px-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Section header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12 space-y-3 px-2.5 md:px-0"
        >
          <h2 className="text-[28px] md:text-[52px] font-bold text-white">
            {t("testimonials.title")}
          </h2>
          {subtitle && (
            <p className="text-sm md:text-base text-white md:text-white/70 max-w-[560px] mx-auto !mt-[4px] md:!mt-3">
              {subtitle}
            </p>
          )}
        </m.div>

        {/* ---------- Carousel for tablet & phone ---------- */}
        {isCarouselActive ? (
          <div className="relative">
            <div className={styles.embla} ref={emblaRef as any}>
              <div className={styles.embla__container}>
                {testimonials.map((testimonial, index) => (
                  <div className={styles.embla__slide} key={index}>
                    <m.div
                      animate={{
                        scale: selectedIndex === index ? 1 : 0.93,
                        opacity: selectedIndex === index ? 1 : 0.55,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <TestimonialCard
                        quote={testimonial.quote}
                        name={testimonial.name}
                        handle={testimonial.handle}
                        avatarUrl={testimonial.avatarUrl}
                        highlighted={testimonial.highlighted}
                        index={index}
                        disableEntryAnimation={disableSlideEntryAnimation}
                      />
                    </m.div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className={styles.dots}>
              {snaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`${styles.dot} ${
                    selectedIndex === index ? styles.dotActive : ""
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* ---------- Desktop: non-carousel grid ---------- */
          <div className="hidden lg:flex flex-wrap gap-8 justify-center items-stretch">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                name={testimonial.name}
                handle={testimonial.handle}
                avatarUrl={testimonial.avatarUrl}
                highlighted={testimonial.highlighted}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
