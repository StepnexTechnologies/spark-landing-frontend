"use client";

import {useEffect, useState} from "react";
import {Lock} from "lucide-react";
import {motion} from "framer-motion";
import Link from "next/link";
import LogoCarousel from "@/components/LogoCarousel";

interface FooterProps {
  minimal?: boolean;
}

export default function Footer({ minimal = false }: FooterProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const FORCE_CREATOR_WEEK = false;
  const isCreatorWeek = (() => {
    if (FORCE_CREATOR_WEEK) return true;
    const now = new Date();
    const start = new Date(2026, 3, 20);
    const end = new Date(2026, 3, 28);
    return now >= start && now < end;
  })();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: minimal ? 0 : 4, duration: 0.5, ease: "easeInOut" }}
      className={
        minimal
          ? "relative w-full select-none z-10 mt-auto pt-8"
          : "fixed bottom-0 w-full left-0 right-0 select-none z-50"
      }
    >
      {!minimal && mounted && isCreatorWeek && (
        <a
          href="https://beta.creator.sparkonomy.com/auth?service=earn"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto relative overflow-hidden block w-full px-[30px] py-3 mb-[30px] text-center cursor-pointer"
          style={{
            background:
              "linear-gradient(90deg, rgba(61, 88, 219, 0) 2.15%, rgba(110, 99, 255, 0.36) 30.53%, rgba(110, 99, 255, 0.36) 62.34%, rgba(61, 88, 219, 0) 96.24%)",
          }}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-y-6 w-[60%] mix-blend-screen"
            style={{
              background:
                "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.06) 65%, transparent 100%)",
              filter: "blur(24px)",
            }}
            initial={{ left: "-60%" }}
            animate={{ left: "100%" }}
            transition={{
              duration: 3.2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 1.4,
            }}
          />
          <p className="relative text-white font-bold text-[16px] leading-tight">
            Your Freelancer to Founder move — on us!{" "}
            <span className="inline-block align-middle ml-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <style>{`
                  .gift-spinner {
                    transform-origin: center;
                    animation: gift-y-axis-spin 3s linear infinite;
                  }
                  @keyframes gift-y-axis-spin {
                    from { transform: rotateY(0deg); }
                    to { transform: rotateY(360deg); }
                  }
                `}</style>
                <g className="gift-spinner">
                  <rect x="25" y="40" width="50" height="40" rx="2" fill="#D32F2F" />
                  <rect x="20" y="32" width="60" height="10" rx="2" fill="#E53935" />
                  <rect x="44" y="32" width="12" height="48" fill="#FDD835" />
                  <rect x="20" y="34" width="60" height="5" fill="#FDD835" />
                  <path d="M50 32 C40 15 25 20 50 32 Z" fill="#FDD835" stroke="#FBC02D" strokeWidth="0.5" />
                  <path d="M50 32 C60 15 75 20 50 32 Z" fill="#FDD835" stroke="#FBC02D" strokeWidth="0.5" />
                  <circle cx="50" cy="32" r="3" fill="#FBC02D" />
                </g>
              </svg>
            </span>
          </p>
          <div
            className="relative overflow-hidden mt-1"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            }}
          >
            <motion.div
              className="flex items-center w-max text-white font-normal text-[12px] leading-snug"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 60, ease: "linear", repeat: Infinity }}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="shrink-0 whitespace-nowrap pr-12">
                  Send invoice → Get <span className="font-bold">12 month ₹3600</span> Pro Plan <span className="font-bold">FREE</span>, only in Creator Week (April 20-26)
                </span>
              ))}
            </motion.div>
          </div>
        </a>
      )}
      <div className="flex flex-col items-center space-y-2 w-full px-10 md:px-14 lg:px-20 pb-4">
        {!minimal && (
          <div className="pointer-events-auto mb-[30px]">
            <LogoCarousel />
          </div>
        )}
        <motion.div
          className="flex items-center justify-center space-x-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 w-fit cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-2 text-[8px] sm:text-sm text-gray-300">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
            </motion.div>
            <Link href="/legal/privacy-policy" className="text-sm">Your data is secure with us</Link>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-[12px] md:text-[14px] text-gray-500 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {/* Left Column */}
          <div className="flex flex-row justify-center items-center md:items-start space-y-1 md:justify-self-start">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/about" className="hover:underline hover:text-purple-400">About Us</Link>
              <Link href="/contact" className="hover:underline hover:text-purple-400">Contact Us</Link>
              <Link href="/blogs" className="hover:underline hover:text-purple-400">Blogs</Link>
            </div>
          </div>

          {/* Center Column - Copyright (always centered) */}
          <div className="flex items-center justify-center space-x-1 md:justify-self-center">
            {/*<Info className="w-3 h-3" />*/}
            <span className="text-center">© 2025-2026 Sparkonomy Pte. Ltd. All rights reserved</span>
          </div>

          {/* Right Column */}
          <div className="flex items-center justify-center md:justify-end space-x-2 md:space-x-4 md:justify-self-end">
            <Link href="/legal/privacy-policy" className="hover:underline hover:text-purple-400">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:underline hover:text-purple-400">Terms of Service</Link>
            <Link href="/legal/refund-policy" className="hover:underline hover:text-purple-400">Refunds</Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
