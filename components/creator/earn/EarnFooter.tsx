"use client";

import {motion} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function EarnFooter() {
  return (
    <footer className="relative py-8 md:py-12 px-5 md:px-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-[1440px] mx-auto"
      >
        <div className="max-w-[392px] md:max-w-[1058px] mx-auto space-y-4">
          {/* Divider Line */}
          <div className="w-full h-[1px] bg-white/20" />

          {/* Logo and Tagline */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative h-9 w-[196px]">
              <Image
                src="/sparkonomy_full.png"
                alt="Sparkonomy Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-[#999999] text-lg leading-[1.4] text-center">
              sparking the creator economy
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex items-center justify-center gap-1 text-gray-500 text-xs">
            <Link href="/legal/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span>|</span>
            <Link href="/legal/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>|</span>
            <span>©All right reserved.</span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
