import Link from "next/link";
import { ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  showArrow?: boolean;
  arrowDirection?: "diagonal" | "right";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  external?: boolean;
}

// Reusable arrow icons
export const ArrowIcons = {
  diagonal: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  ),
  right: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function GradientButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  showArrow = true,
  arrowDirection = "diagonal",
  className = "",
  type = "button",
  disabled = false,
  external = false,
}: GradientButtonProps) {
  const baseClasses = `inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 ${sizeClasses[size]}`;

  const variantClasses = {
    primary: "text-white hover:opacity-90",
    outline: "border-2 border-[#9747FF] text-[#9747FF] hover:bg-[#9747FF] hover:text-white bg-white",
  };

  const gradientStyle = variant === "primary"
    ? { background: "linear-gradient(180.27deg, #DD2A7B -46.92%, #9747FF 80.1%)" }
    : {};

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  const content = (
    <>
      {children}
      {showArrow && ArrowIcons[arrowDirection]}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
          style={gradientStyle}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses} style={gradientStyle}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${combinedClasses} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      style={gradientStyle}
    >
      {content}
    </button>
  );
}
