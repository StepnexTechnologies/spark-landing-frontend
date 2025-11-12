"use client";

import { useForm } from "@tanstack/react-form";
import { useEffect, useState, useRef } from "react";

export default function NewsletterSection() {
  const [isFixed, setIsFixed] = useState(false);
  const [placeholderHeight, setPlaceholderHeight] = useState(0);
  const originalPositionRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      // Handle newsletter subscription
      console.log("Subscribe:", value.email);
    },
  });

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollThreshold = window.innerHeight * 2; // 2 viewports
          const currentScrollY = window.scrollY;
          const newsletterSection = sectionRef.current;

          if (newsletterSection) {
            // Store original position only once on first load (without any fixed positioning)
            if (originalPositionRef.current === null) {
              const rect = newsletterSection.getBoundingClientRect();
              originalPositionRef.current = currentScrollY + rect.top;
              setPlaceholderHeight(newsletterSection.offsetHeight);
            }

            const originalPos = originalPositionRef.current;

            // Get distance from bottom of viewport to check if we reached the original position
            const windowBottom = currentScrollY + window.innerHeight;
            const distanceToOriginal = originalPos - windowBottom;

            // Calculate when to show/hide fixed position
            // Show fixed: after 2 viewports AND haven't scrolled to within view of original position
            const shouldBeFixed =
              currentScrollY > scrollThreshold &&
              originalPos !== null &&
              distanceToOriginal > 0; // Still above the original position

            if (shouldBeFixed !== isFixed) {
              setIsFixed(shouldBeFixed);
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Small delay for initial calculation
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFixed]);

  return (
    <>
      {/* Placeholder to prevent layout shift when fixed */}
      {isFixed && <div style={{ height: `${placeholderHeight}px` }} className="w-full" />}

      <section
        ref={sectionRef}
        id="newsletter"
        className={`w-full transition-all duration-300 ease-in-out ${
          isFixed
            ? 'fixed bottom-0 left-0 right-0 z-40'
            : 'relative'
        }`}
      >
      {/* Desktop Layout */}
      <div className={`hidden md:flex items-center justify-center gap-10 lg:gap-[120px] py-4 bg-[#F2F2F2] px-4 transition-shadow duration-300 ${isFixed ? 'shadow-[0_-4px_16px_rgba(0,0,0,0.1)]' : ''}`}>
        <h2 className="text-2xl lg:text-[32px] py-2 font-bold bg-gradient-to-b from-[#DD2A7B] via-[#9747FF] to-[#334CCA] text-transparent bg-clip-text whitespace-nowrap">
          Sign Up, Stay Updated
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex-1 flex items-center gap-4 max-w-2xl"
        >
          <div className="flex w-full px-1 py-1 rounded-full border-2 border-primary relative">
            <form.Field name="email">
              {(field) => (
                <input
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      form.handleSubmit();
                    }
                  }}
                  placeholder="Enter Your Email/ WhatsApp Number"
                  className="w-full px-3 rounded-full bg-transparent text-[#999999] placeholder:text-[#999999]/90 focus:outline-none"
                />
              )}
            </form.Field>
            <button
              type="submit"
              style={{
                background:
                  "linear-gradient(309.99deg, #DD2A7B 3.31%, #9747FF 39.79%, #334CCA 91.72%)",
              }}
              className="flex items-center gap-2 px-8 py-4 rounded-full text-white font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Subscribe Now
              <svg
                className="w-5 h-5"
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
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Layout */}
      <div className={`md:hidden flex flex-col items-center text-center py-4 bg-[#F2F2F2] px-4 transition-shadow duration-300 ${isFixed ? 'shadow-[0_-4px_16px_rgba(0,0,0,0.1)]' : ''}`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="w-full max-w-md"
        >
          <div className="flex items-center border-2 border-primary rounded-full px-1 py-1">
            <form.Field name="email">
              {(field) => (
                <input
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      form.handleSubmit();
                    }
                  }}
                  placeholder="Enter Your Email/ WhatsApp Number"
                  className="flex-1  px-3 py-2 focus:outline-none bg-transparent text-[#999999] placeholder:text-[#999999]/90 text-sm rounded-full"
                />
              )}
            </form.Field>
            <button
              type="submit"
              style={{
                background:
                  "linear-gradient(309.99deg, #DD2A7B 3.31%, #9747FF 39.79%, #334CCA 91.72%)",
              }}
              className="flex items-center gap-2  p-3 text-white font-medium hover:opacity-90 transition-opacity whitespace-nowrap text-sm rounded-full"
            >
             
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
            </button>
          </div>
        </form>
      </div>
    </section>
    </>
  );
}
