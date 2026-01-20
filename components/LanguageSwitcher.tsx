"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "en", label: "English" },
    { code: "hi-Latn", label: "Hinglish" },
  ];

  const currentLang = i18n.language?.startsWith("hi") ? "hi-Latn" : "en";
  const currentLanguage =
    languages.find((lang) => lang.code === currentLang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (langCode: string) => {
    i18n.changeLanguage(langCode);

    // Update URL if lang param exists in current URL
    if (searchParams.has("lang")) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("lang", langCode);
      router.replace(`${pathname}?${params.toString()}`);
    }

    setIsOpen(false);
  };

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className={`relative ${className}`}
    >
      {/* Wrapper for glass effect + gradient border */}
      <div className="relative w-fit h-fit">
        {/* Shine + Gradient Border Layer */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `
              linear-gradient(135deg,
                rgba(255,255,255,0.35) 0%,
                rgba(255,255,255,0.12) 30%,
                rgba(255,255,255,0.05) 50%,
                rgba(255,255,255,0.12) 70%,
                rgba(255,255,255,0.35) 100%
              )
            `,
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        />

        {/* Inner button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
            relative z-10 flex items-center gap-2
            px-4 py-2.5
            rounded-full
            bg-transparent
            text-white
            select-none
          "
        >
          <Globe className="w-[18px] h-[18px] opacity-90" />
          <span className="text-[15px] font-medium">{currentLanguage.label}</span>
          <ChevronDown
            className={`
              w-[16px] h-[16px] opacity-90 transition-transform duration-200
              ${isOpen ? "rotate-180" : ""}
            `}
          />
        </button>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="
              absolute top-full mt-2 right-0
              min-w-[155px]
              rounded-xl
              p-1.5
              overflow-hidden
              backdrop-blur-xl
              z-50
            "
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`
                  w-full flex items-center justify-between
                  px-3 py-2.5
                  rounded-xl text-sm
                  transition-all duration-150
                  ${
                    currentLang === lang.code
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <span>{lang.label}</span>
                {currentLang === lang.code && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LanguageSwitcher;
