"use client";

import {motion} from "framer-motion";
import TestimonialCard from "./TestimonialCard";
import {useEffect, useState} from "react";

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Set initial width
    setWindowWidth(window.innerWidth);

    // Update on resize
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const testimonials = [
    {
      quote:
        "Streamlined invoices that not only speed up your payments but also enhance your professional image!",
      name: "Alex Cooper",
      handle: "@alex.cop",
      avatarUrl:
        "https://www.figma.com/api/mcp/asset/68c70e45-5a7e-4297-ac43-5be68d0a7b06",
      highlighted: false,
    },
    {
      quote:
        "Streamlined invoices that not only speed up your payments but also enhance your professional image!",
      name: "Alex Cooper",
      handle: "@alex.cop",
      avatarUrl:
        "https://www.figma.com/api/mcp/asset/68c70e45-5a7e-4297-ac43-5be68d0a7b06",
      highlighted: false,
    },
    {
      quote:
        "Streamlined invoices that not only speed up your payments but also enhance your professional image!",
      name: "Alex Cooper",
      handle: "@alex.cop",
      avatarUrl:
        "https://www.figma.com/api/mcp/asset/68c70e45-5a7e-4297-ac43-5be68d0a7b06",
      highlighted: false,
    },
    {
      quote:
        "Streamlined invoices that not only speed up your payments but also enhance your professional image!",
      name: "Alex Cooper",
      handle: "@alex.cop",
      avatarUrl:
        "https://www.figma.com/api/mcp/asset/68c70e45-5a7e-4297-ac43-5be68d0a7b06",
      highlighted: false,
    },
  ];

  const onDragEnd = (_event: any, info: any) => {
    const offset = info.offset.x;
    const threshold = 50;

    if (offset < -threshold && currentSlide < testimonials.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (offset > threshold && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Calculate position to center active card
  // Card width: 299px, Gap: 16px (gap-4), Total per card: 315px
  const cardWidth = 315;
  const cardHalfWidth = 299 / 2;
  const centerOffset = windowWidth / 2 - cardHalfWidth;
  const offsetX = -(currentSlide * cardWidth) + centerOffset;

  return (
    <section className="relative py-4 px-5 md:px-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
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
          <p className="text-base text-white max-w-[292px] md:max-w-full mx-auto">
            Invoices that get you paid faster, and make you look good!
          </p>
        </motion.div>

        {/* Mobile/Tablet Carousel */}
        <div className="lg:hidden overflow-hidden">
          <motion.div
            drag="x"
            dragConstraints={{
              left: -(testimonials.length - 1) * cardWidth + centerOffset,
              right: centerOffset
            }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            animate={{ x: offsetX }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex gap-4 items-center"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                animate={{
                  scale: currentSlide === index ? 1 : 0.85,
                  opacity: currentSlide === index ? 1 : 0.5,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex-shrink-0"
                style={{ width: "299px" }}
              >
                <TestimonialCard
                  quote={testimonial.quote}
                  name={testimonial.name}
                  handle={testimonial.handle}
                  avatarUrl={testimonial.avatarUrl}
                  highlighted={testimonial.highlighted}
                  index={0}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "bg-white w-6"
                    : "bg-white/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Row */}
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
      </div>
    </section>
  );
}
