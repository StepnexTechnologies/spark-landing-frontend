"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel, { UseEmblaCarouselType } from "embla-carousel-react";
import TestimonialCard from "./TestimonialCard";
import styles from "./carousel.module.css";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  // track window width client-side (SSR-safe)
  useEffect(() => {
    const setWidth = () => setWindowWidth(window.innerWidth);
    setWidth();
    window.addEventListener("resize", setWidth);
    return () => window.removeEventListener("resize", setWidth);
  }, []);

  // only active for tablet and phone
  const isCarouselActive = windowWidth > 0 && windowWidth < 1024; // Tailwind `lg`

  const testimonials = useMemo(
    () => [
      {
        quote:
          "And I have to reach out so many times to get paid in 3 months, and still it hasn't happened 15-20 times! I want you to do my payment reminders",
        name: "Food YouTuber",
        handle: "700K Followers",
        avatarUrl: "/images/creator/earn/testimonial-1.png",
        highlighted: false,
      },
      {
        quote:
          "I raise invoices once a month mostly..don't get time… and it delays my payments. I want you help me raise instant invoices in under 5 mins from my phone",
        name: "Tech Instagrammer",
        handle: "1M Followers",
        avatarUrl: "/images/creator/earn/testimonial-2.png",
        highlighted: false,
      },
      {
        quote:
          "I don't have time to write down and track all payments in Excel and become my own accountant! I want you to track & remind me of my money matters",
        name: "Lifestyle Instagrammer",
        handle: "320K Followers",
        avatarUrl: "/images/creator/earn/testimonial-3.png",
        highlighted: false,
      },
    ],
    []
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
            What People Say
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
