import React from "react";
import Link from "next/link";

interface ReadMoreButtonProps {
  href: string;
  className?: string;
}

export default function ReadMoreButton({ href, className = "" }: ReadMoreButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-full hover:opacity-90 transition-opacity ${className}`}
      style={{
        background: 'linear-gradient(180.27deg, #DD2A7B -46.92%, #9747FF 80.1%)'
      }}
    >
      Read More
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 17L17 7M17 7H7M17 7V17"
        />
      </svg>
    </Link>
  );
}
