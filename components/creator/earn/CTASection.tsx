"use client";

import {motion} from "framer-motion";
import CTAButton from "./CTAButton";

export default function CTASection() {
  return (
    <section className="relative py-12 md:py-20 px-5 md:px-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[1440px] mx-auto"
      >
        <div className="max-w-[348px] md:max-w-[1060px] mx-auto">
          {/* CTA Card */}
          <div className="border-2 border-[#dd2a7b] rounded-[24px] p-8 md:p-8 flex flex-col items-center justify-center gap-8 min-h-[253px]">
            {/* Heading */}
            <h2 className="text-[40px] md:text-[52px] font-bold text-white text-center leading-tight">
              Ready to get paid faster?
            </h2>

            {/* CTA Button */}
              <CTAButton buttonText={"Make your first Invoice Now"}/>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
