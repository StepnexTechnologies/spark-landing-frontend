"use client";

import {motion} from "framer-motion";
import CTAButton from "./CTAButton";

export default function ValueProposition() {
  return (
    <section className="relative py-12 md:py-20 px-5 md:px-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-[1440px] mx-auto text-center"
      >
        <div className="max-w-[321px] md:max-w-[931px] mx-auto space-y-6 md:space-y-8">
          {/* Main Heading */}
          <h2 className="text-[40px] md:text-[52px] font-bold text-white leading-tight lg:inline-flex">
            <span className="block md:inline md:text-nowrap">Earn More. Stress Less.</span>
            <span className="block md:text-nowrap">Get Paid Faster!</span>
          </h2>

          {/* Description */}
          <p className="text-base md:text-base text-white leading-normal max-w-[321px] md:max-w-full mx-auto">
            Late payments, endless reminders, messy tax calculations —gone! Meet
            the first AI built for creators, starting with smart payments that
            help you earn more, faster. We handle the headache, you spark the
            content.
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
              <CTAButton buttonText={"Send Invoices For Free"}/>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
