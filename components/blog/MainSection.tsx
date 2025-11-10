import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MainSectionProps {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
  hashtags?: string[];
}

export default function MainSection({
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  imageSrc,
  hashtags = ["MonetizeYourContent", "CreatorEconomy", "PassiveIncome"],
}: MainSectionProps) {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[690px] overflow-hidden rounded-b-[40px] md:rounded-b-[60px]">

      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />

      </div>
      <div className="relative h-full max-w-7xl mx-auto flex items-end pb-20">
        <div className="max-w-xl lg:max-w-2xl text-white">

          <h1 className="text-3xl md:text-4xl lg:text-[52px] xl:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 font-normal text-white leading-relaxed max-w-lg">
            {description}
          </p>

          {/* Button */}
          <Link
            href={buttonLink}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-full hover:opacity-90 transition-opacity"
            style={{
              background: 'linear-gradient(180.27deg, #DD2A7B -46.92%, #9747FF 80.1%)'
            }}
          >
            {buttonText}
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
        </div>
      </div>
    </section>
  );
}
