import React from "react";
import Link from "next/link";
import Image from "next/image";

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
      <Image
        src="/Arrow_navigate.png"
        alt="arrow"
        width={16}
        height={16}
      />
    </Link>
  );
}
