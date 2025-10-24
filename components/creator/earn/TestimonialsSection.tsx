"use client";

import {motion} from "framer-motion";
import TestimonialCard from "./TestimonialCard";

export default function TestimonialsSection() {
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
      highlighted: true,
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

  return (
    <section className="relative py-12 md:py-20 px-5 md:px-20">
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
            What People Says
          </h2>
          <p className="text-base text-white max-w-[292px] md:max-w-full mx-auto">
            Invoices that get you paid faster, and make you look good!
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="flex flex-wrap gap-8 justify-center items-stretch">
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
