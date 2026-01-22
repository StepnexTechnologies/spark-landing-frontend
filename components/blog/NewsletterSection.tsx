"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import ToggleInput from "@/components/form/ToggleInput";

export default function NewsletterSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const originalPositionRef = useRef<number | null>(null);
  const lastScrollYRef = useRef<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (value: string, type: 'email' | 'phone') => {
    setLoading(true);

    try {
      const payload = type === 'email'
        ? { email: value, phone_number: null }
        : { email: null, phone_number: value };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/blogs/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to subscribe");
      }

      toast.success(data.message || "Successfully subscribed!");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollThreshold = window.innerHeight;
          const currentScrollY = window.scrollY;
          const lastScrollY = lastScrollYRef.current;
          const newsletterSection = sectionRef.current;

          if (newsletterSection) {
            if (originalPositionRef.current === null) {
              const rect = newsletterSection.getBoundingClientRect();
              originalPositionRef.current = currentScrollY + rect.top;
            }

            const originalPos = originalPositionRef.current;
            const windowBottom = currentScrollY + window.innerHeight;
            const distanceToOriginal = originalPos - windowBottom;
            const isScrollingUp = currentScrollY < lastScrollY;

            let shouldBeVisible = isVisible;

            if (currentScrollY <= scrollThreshold) {
              shouldBeVisible = false;
            } else if (distanceToOriginal <= 0) {
              shouldBeVisible = false;
            } else if (isScrollingUp) {
              shouldBeVisible = true;
            } else {
              shouldBeVisible = false;
            }

            if (shouldBeVisible !== isVisible) {
              setIsVisible(shouldBeVisible);
            }
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isVisible]);

  return (
    <>
      {/* Static section for natural page flow */}
      <div ref={sectionRef} id="newsletter" className="w-full">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-center gap-10 lg:gap-[120px] py-4 bg-[#F2F2F2] px-4">
          <h2 className="text-2xl lg:text-[32px] py-2 font-bold bg-gradient-to-b from-[#DD2A7B] via-[#9747FF] to-[#334CCA] text-transparent bg-clip-text whitespace-nowrap">
            Sign Up, Stay Updated
          </h2>

          <div className="flex-1 max-w-2xl">
            <ToggleInput
              onSubmit={handleSubmit}
              loading={loading}
              placeholder={{
                email: "Enter your email",
                phone: "Enter your phone number",
              }}
              buttonText="Stay Updated"
              variant="light"
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col items-center text-center py-4 bg-[#F2F2F2] px-4">
          <div className="w-full max-w-md">
            <ToggleInput
              onSubmit={handleSubmit}
              loading={loading}
              placeholder={{
                email: "Enter Your Email",
                phone: "Enter Your Phone Number",
              }}
              buttonText=""
              variant="light"
            />
          </div>
        </div>

      </div>

      {/* Floating/Fixed version with animation */}
      <AnimatePresence>
        {isVisible && !isDismissed && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="fixed bottom-0 left-0 right-0 z-40"
          >
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-center gap-10 lg:gap-[120px] py-4 bg-[#F2F2F2] px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.1)]">
              <h2 className="text-2xl lg:text-[32px] py-2 font-bold bg-gradient-to-b from-[#DD2A7B] via-[#9747FF] to-[#334CCA] text-transparent bg-clip-text whitespace-nowrap">
                Sign Up, Stay Updated
              </h2>

              <div className="flex-1 max-w-2xl">
                <ToggleInput
                  onSubmit={handleSubmit}
                  loading={loading}
                  placeholder={{
                    email: "Enter your email",
                    phone: "Enter your phone number",
                  }}
                  buttonText="Stay Updated"
                  variant="light"
                />
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col items-center text-center py-4 bg-[#F2F2F2] px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] relative">
              {/* Close button */}
              <button
                onClick={() => setIsDismissed(true)}
                className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close newsletter banner"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Heading */}
              <h2 className="text-[20px] font-bold bg-gradient-to-b from-[#DD2A7B] via-[#9747FF] to-[#334CCA] text-transparent bg-clip-text mb-3">
                Sign Up, Stay Updated
              </h2>

              <div className="w-full max-w-md">
                <ToggleInput
                  onSubmit={handleSubmit}
                  loading={loading}
                  placeholder={{
                    email: "Enter Your Email",
                    phone: "Enter Your Phone Number",
                  }}
                  buttonText=""
                  variant="light"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
