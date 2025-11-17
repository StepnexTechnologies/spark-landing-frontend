"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gradient" | "filled";
  size?: "sm" | "md" | "lg";
}

const Button: React.FC<ButtonProps> = ({
  variant = "gradient",
  size = "md",
  className,
  children,
  ...props
}) => {
  const sizes = {
    sm: "px-[10px] py-[16px] text-sm",
    md: "px-[16px] py-[16px] text-sm",
    lg: "px-[32px] py-[16px] text-base",
  };

  const baseStyles =
    "rounded-full font-medium transition-all duration-300 focus:outline-none";

  const variants = {
    gradient:
      "bg-white text-[#8134AF] hover:bg-gradient-to-b hover:from-[#DD2A7B] hover:via-[#9747FF] hover:to-[#334CCA] hover:text-white active:bg-white active:text-[#8134AF]",
    filled:
      "bg-gradient-to-b from-[#DD2A7B] via-[#9747FF] to-[#334CCA] text-white hover:opacity-90 active:opacity-100",
  };

  const buttonClasses = twMerge(
    baseStyles,
    sizes[size],
    variants[variant],
    className
  );

  if (variant === "gradient") {
    return (
      <div className="rounded-full p-[1px] bg-gradient-to-b from-[#DD2A7B] via-[#9747FF] to-[#334CCA]">
        <button className={buttonClasses} {...props}>
          {children}
        </button>
      </div>
    );
  }

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
