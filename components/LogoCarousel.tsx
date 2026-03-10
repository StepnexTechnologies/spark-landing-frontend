"use client";

import Image from "next/image";

const logos = [
  { src: "/logos/Meta_White.png", alt: "Built with Meta", width: 120 },
  { src: "/logos/Yt_White.png", alt: "Developed with YouTube", width: 120 },
  { src: "/logos/Google_White.png", alt: "Google for Startups", width: 120 },
  { src: "/logos/Gemini_White.png", alt: "Gemini Early Access Program", width: 120 },
  { src: "/logos/CCPA_White.png", alt: "CCPA", width: 40 },
  { src: "/logos/GDPR_White.png", alt: "GDPR", width: 40 },
  { src: "/logos/DPDP_White.png", alt: "DPDP", width: 40 },
];

const LogoCarousel = () => {
  return (
    <div
      className="overflow-hidden max-w-[350px] md:max-w-[500px] mx-auto"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
      }}
    >
      <div className="logo-carousel-track flex items-center gap-[32px] w-max">
        {[...Array(2)].map((_, setIndex) => (
          <div key={setIndex} className="flex items-center gap-[32px] shrink-0">
            {logos.map((logo, i) => (
              <div key={`${setIndex}-${i}`} className="shrink-0">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  height={50}
                  width={logo.width}
                  className="h-[50px] w-auto object-contain"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoCarousel;
