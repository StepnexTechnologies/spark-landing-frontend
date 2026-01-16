"use client";

import {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import {Search} from "lucide-react";
import type {Country} from "@/lib/data/countries";

interface CountryListProps {
  countries: Country[];
  selectedCountry: Country;
  onSelect: (country: Country) => void;
  onClose: () => void;
}

export default function CountryList({
  countries,
  selectedCountry,
  onSelect,
  onClose,
}: CountryListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Filter countries based on search query
  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery)
  );

  // Focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredCountries.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCountries[highlightedIndex]) {
            onSelect(filteredCountries[highlightedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filteredCountries, highlightedIndex, onSelect, onClose]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex]);

  // Reset highlighted index when search changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={dropdownVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="absolute top-full left-0 right-0 mt-2 w-64 bg-black/90 backdrop-blur-sm border border-purple-400/30 rounded-lg shadow-xl z-50 overflow-hidden"
    >
      {/* Search input */}
      <div className="p-3 border-b border-purple-400/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search countries..."
            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
          />
        </div>
      </div>

      {/* Country list */}
      <div
        ref={listRef}
        className="max-h-[300px] overflow-y-auto scrollbar-hide"
      >
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country, index) => (
            <button
              key={`${country.code}-${country.dialCode}`}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              type="button"
              onClick={() => onSelect(country)}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-all duration-200 ${
                highlightedIndex === index
                  ? "bg-purple-500/20 border-l-2 border-purple-400"
                  : "hover:bg-purple-500/10"
              } ${
                selectedCountry.code === country.code
                  ? "bg-purple-500/10"
                  : ""
              }`}
            >
              <span className="text-xl">{country.flag}</span>
              <span className="text-purple-400 font-mono text-sm min-w-[50px]">
                {country.dialCode}
              </span>
              <span className="text-white text-sm flex-1">{country.name}</span>
            </button>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">
            No countries found
          </div>
        )}
      </div>
    </motion.div>
  );
}
