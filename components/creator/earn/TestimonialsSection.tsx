"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel, { UseEmblaCarouselType } from "embla-carousel-react";
import { useTranslation } from "react-i18next";
import TestimonialCard from "./TestimonialCard";
import styles from "./carousel.module.css";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const { t, ready } = useTranslation("creatorEarn");
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // track window width client-side (SSR-safe)
  useEffect(() => {
    const setWidth = () => setWindowWidth(window.innerWidth);
    setWidth();
    window.addEventListener("resize", setWidth);
    return () => window.removeEventListener("resize", setWidth);
  }, []);

  // only active for tablet and phone
  const isCarouselActive = windowWidth > 0 && windowWidth < 1024; // Tailwind `lg`

  if (!mounted || !ready) {
    return null;
  }

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
      containScroll: "trimSnaps" as const,
      loop: false,
      draggable: true,
      skipSnaps: false,
    }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);
  const [selectedIndex, setSelectedIndex] = useState<number>(1); // Start with 2nd card

  const onSelect = useCallback((embla?: UseEmblaCarouselType[1]) => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", () => onSelect(emblaApi));
    emblaApi.on("reInit", () => onSelect(emblaApi));
    // Scroll to 2nd card (index 1) on init
    emblaApi.scrollTo(1, true); // true = instant, no animation
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const snaps = emblaApi ? emblaApi.scrollSnapList() : testimonials.map((_, i) => i);

  return (
    <section className="relative py-4 md:px-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12 space-y-3"
        >
          <h2 className="text-2xl md:text-[52px] font-bold text-white">
            {t("testimonials.title")}
          </h2>
        </motion.div>

        {/* ---------- Carousel for tablet & phone ---------- */}
        {isCarouselActive ? (
          <div className="relative">
            <div className={styles.embla} ref={emblaRef as any}>
              <div className={styles.embla__container}>
                {testimonials.map((testimonial, index) => (
                  <div className={styles.embla__slide} key={index}>
                    <motion.div
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
                      />
                    </motion.div>
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
