"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";

interface BlogLanguageSwitcherProps {
  className?: string;
}

export const BlogLanguageSwitcher = ({ className }: BlogLanguageSwitcherProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "en", label: "English", disabled: false },
    { code: "hi-Latn", label: "Hinglish", disabled: true },
  ];

  const currentLangParam = searchParams.get("lang");
  const currentLang = currentLangParam && ["en", "hi-Latn"].includes(currentLangParam)
    ? currentLangParam
    : "en";
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
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", langCode);
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className={`relative ${className}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-1.5
          px-3 py-1.5
          rounded-full
          bg-gray-100 hover:bg-gray-200
          text-[#6B7280]
          transition-colors duration-200
          select-none
        "
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage.label}</span>
        <ChevronDown
          className={`
            w-3.5 h-3.5 transition-transform duration-200
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="
              absolute top-full mt-2 left-0
              min-w-[140px]
              rounded-2xl
              p-1.5
              overflow-hidden
              bg-white
              border border-gray-200
              shadow-lg
              z-50
            "
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => !lang.disabled && handleLanguageSelect(lang.code)}
                disabled={lang.disabled}
                className={`
                  w-full flex items-center justify-between
                  px-3 py-2
                  rounded-xl text-sm
                  transition-all duration-150
                  ${
                    lang.disabled
                      ? "text-gray-300 cursor-not-allowed"
                      : currentLang === lang.code
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <span>{lang.label}</span>
                {currentLang === lang.code && !lang.disabled && (
                  <Check className="w-4 h-4 text-gray-900" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BlogLanguageSwitcher;
