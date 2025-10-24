"use client";

import {motion} from "framer-motion";
import {ReactNode} from "react";

interface CTAButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CTAButton({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  className = "",
}: CTAButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-3 text-base md:text-lg",
  };

  const variantClasses = {
    primary:
      "bg-white/10 ring-1 ring-[#dd2a7b] ring-offset-2 backdrop-blur-sm hover:bg-white/20",
    secondary: "bg-[#dd2a7b] hover:bg-[#c42569]",
  };

  const baseClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    rounded-full
    font-medium
    text-white
    transition-all
    duration-300
    cursor-pointer
    inline-flex
    items-center
    justify-center
    gap-2
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const content = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <a href={href} className={baseClasses} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button className={baseClasses} onClick={onClick}>
      {content}
    </button>
  );
}
