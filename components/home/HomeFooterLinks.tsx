"use client";

import {motion} from "framer-motion";
import Link from "next/link";

interface HomeFooterLinksProps {
  className?: string;
}

// Mobile-only condensed link row (matches the screenshot design).
// Desktop keeps the 3-column grid further below.
const MOBILE_LINKS = [
  {href: "/about", label: "About Us"},
  {href: "/legal/privacy-policy", label: "Privacy"},
  {href: "/legal/terms", label: "Terms"},
  {href: "/legal/refund-policy", label: "Refunds"},
  {href: "/contact", label: "Contact Us"},
  {href: "/blogs", label: "Blogs"},
];

export default function HomeFooterLinks({className}: HomeFooterLinksProps) {
  return (
    <motion.div
      className={`pointer-events-auto w-full ${className ?? ""}`}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{delay: 0.8}}
    >
      {/* Mobile (<md): single row of links + centered copyright below */}
      <div className="md:hidden flex flex-col items-center gap-2 w-full">
        <div className="flex items-center justify-center gap-x-3 text-[11px] text-gray-400 w-full">
          {MOBILE_LINKS.map(({href, label}) => (
            <Link
              key={href}
              href={href}
              className="whitespace-nowrap hover:underline hover:text-purple-400 transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>
        <p className="text-[11px] text-gray-500 text-center">
          © Sparkonomy Pte. Ltd. All rights reserved
        </p>
      </div>

      {/* Desktop (≥md): original 3-column grid */}
      <div className="hidden md:grid grid-cols-3 gap-4 text-[14px] text-gray-500">
        <div className="flex flex-row justify-self-start items-start space-y-1">
          <div className="flex items-center space-x-4">
            <Link href="/about" className="hover:underline hover:text-purple-400">
              About Us
            </Link>
            <Link href="/contact" className="hover:underline hover:text-purple-400">
              Contact Us
            </Link>
            <Link href="/blogs" className="hover:underline hover:text-purple-400">
              Blogs
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-self-center space-x-1">
          <span className="text-center">
            © 2025-2026 Sparkonomy Pte. Ltd. All rights reserved
          </span>
        </div>

        <div className="flex items-center justify-self-end space-x-4">
          <Link
            href="/legal/privacy-policy"
            className="hover:underline hover:text-purple-400"
          >
            Privacy Policy
          </Link>
          <Link href="/legal/terms" className="hover:underline hover:text-purple-400">
            Terms of Service
          </Link>
          <Link
            href="/legal/refund-policy"
            className="hover:underline hover:text-purple-400"
          >
            Refunds
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
