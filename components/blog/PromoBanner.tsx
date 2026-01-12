import Link from "next/link";

interface PromoBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function PromoBanner({
  title = "We've now added support for JSON Schema to all actively supported Gemini models.",
  subtitle = "This enables libraries like Pydantic (Python) or Zod (JavaScript/TypeScript).",
  ctaText = "Try Out Now",
  ctaLink = "https://sparkonomy.com",
}: PromoBannerProps) {
  return (
    <div className="promo-banner">
      <div className="promo-banner-content">
        <p className="promo-banner-text">
          {title} {subtitle}
        </p>
        <Link href={ctaLink} target="_blank" rel="noopener noreferrer" className="promo-banner-cta">
          {ctaText}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="promo-banner-arrow"
          >
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </Link>
      </div>
    </div>
  );
}
