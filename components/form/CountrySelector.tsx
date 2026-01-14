"use client";

import {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {ChevronDown} from "lucide-react";
import type {Country} from "@/lib/data/countries";
import {countries} from "@/lib/data/countries";
import CountryList from "./CountryList";

interface CountrySelectorProps {
  selectedCountry: Country;
  onSelectCountry: (country: Country) => void;
  isValid?: boolean;
}

export default function CountrySelector({
  selectedCountry,
  onSelectCountry,
    isValid,
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (country: Country) => {
    onSelectCountry(country);
    setIsOpen(false);
  };

    const inputVariants = {
        initial: {
            borderColor: isValid ? "rgba(108, 99, 255, 0.5)" : "rgba(239, 68, 68, 0.5)",
            boxShadow: "0 0 0 rgba(108, 99, 255, 0)",
        },
        focus: {
            borderColor: isValid ? "rgba(108, 99, 255, 1)" : "rgba(239, 68, 68, 1)",
            boxShadow: isValid
                ? "0 0 20px rgba(108, 99, 255, 0.3)"
                : "0 0 20px rgba(239, 68, 68, 0.3)",
        },
    };

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        variants={inputVariants}
        whileHover={{ borderColor: "rgba(108, 99, 255, 0.8)" }}
        // className="flex items-center gap-2 px-3 py-2.5 bg-black/50 backdrop-blur-sm border-2 border-purple-500/50 border-r-0 rounded-l-lg text-white hover:border-purple-400 transition-all duration-300 min-w-[100px]"
        className={`flex items-center w-full gap-2 px-3 py-2.5 bg-black/50 backdrop-blur-sm border-2 ${
            isValid ? "border-purple-500/50" : "border-red-500/50"
        } border-r-0 rounded-r-lg text-white placeholder-gray-400 focus:outline-none ${
            isValid ? "focus:border-purple-400" : "focus:border-red-400"
        } transition-all duration-300`}
      >
        <span className="text-lg">{selectedCountry.flag}</span>
        <span className="text-sm font-mono">{selectedCountry.dialCode}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <CountryList
            countries={countries}
            selectedCountry={selectedCountry}
            onSelect={handleSelect}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
