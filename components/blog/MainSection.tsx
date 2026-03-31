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
  textAlign?: "left" | "right";
}

function CtaButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-full hover:opacity-90 transition-opacity"
      style={{
        background: 'linear-gradient(180.27deg, #DD2A7B -46.92%, #9747FF 80.1%)'
      }}
    >
      {children}
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
      </svg>
    </Link>
  );
}

export default function MainSection({
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  imageSrc,
  hashtags = ["MonetizeYourContent", "CreatorEconomy", "PassiveIncome"],
  textAlign = "left",
}: MainSectionProps) {
  const isRight = textAlign === "right";
  const overlayGradient = isRight
    ? "bg-gradient-to-r from-black/10 via-black/25 to-black/65"
    : "bg-gradient-to-r from-black/65 via-black/25 to-black/10";
  const truncatedDescription = description.length > 160
    ? `${description.substring(0, 160)}...`
    : description;

  return (
    <section className="w-full overflow-hidden rounded-b-[40px] md:rounded-b-[60px]">
      {/* Desktop: overlay layout */}
      <div className="hidden md:block relative w-full md:h-[500px] lg:h-[690px]">
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          <div className={`absolute inset-0 pointer-events-none ${overlayGradient}`} />
        </div>
        <div className={`relative h-full max-w-7xl px-[24px] lg:px-[84px] flex items-end pb-10 lg:pb-20 ${isRight ? "ml-auto" : ""}`}>
          <div className={`md:max-w-lg lg:max-w-2xl text-white ${isRight ? "ml-auto text-right" : ""}`}>
            <Link href={buttonLink}>
              <h1 className="md:text-4xl lg:text-[52px] xl:text-6xl font-bold mb-6 leading-tight cursor-pointer">
                {title}
              </h1>
            </Link>
            <p className="md:text-lg lg:text-xl mb-8 font-normal text-white leading-relaxed max-w-lg lg:max-w-2xl">
              {truncatedDescription}
            </p>
            <CtaButton href={buttonLink}>{buttonText}</CtaButton>
          </div>
        </div>
      </div>

      {/* Mobile: image on top, content below */}
      <div className="md:hidden flex flex-col">
        <div className="relative w-full h-[280px]">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
        </div>
        <div className={`px-6 py-8 bg-white ${isRight ? "text-right" : ""}`}>
          <Link href={buttonLink}>
            <h1 className="text-2xl font-semibold mb-4 leading-tight cursor-pointer text-[#212529]">
              {title}
            </h1>
          </Link>
          <p className="text-sm mb-6 font-normal text-[#999999] leading-relaxed">
            {truncatedDescription}
          </p>
          <CtaButton href={buttonLink}>{buttonText}</CtaButton>
        </div>
      </div>
    </section>
  );
}
