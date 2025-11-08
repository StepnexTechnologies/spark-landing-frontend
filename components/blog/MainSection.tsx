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
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-b-[40px] md:rounded-b-[60px]">

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
      <div className="relative h-full max-w-7xl mx-auto px-6 md:px-8 lg:px-12 flex items-center">
        <div className="max-w-xl lg:max-w-2xl text-white">
          {/* Hashtags */}
          {hashtags && hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs md:text-sm font-medium text-white/90"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm md:text-base font-medium mb-2 text-white/95">
              {subtitle}
            </p>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-sm md:text-base lg:text-lg mb-6 md:mb-8 text-white/90 leading-relaxed max-w-lg">
            {description}
          </p>

          {/* Button */}
          <Link
            href={buttonLink}
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-pink-600 font-semibold rounded-full hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {buttonText}
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
