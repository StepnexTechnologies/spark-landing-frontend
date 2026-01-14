"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {AsYouType, getExampleNumber, isValidPhoneNumber} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";
import type {Country} from "@/lib/data/countries";
import {countries} from "@/lib/data/countries";
import CountrySelector from "./CountrySelector";

interface PhoneInputProps {
  value: string;
  onChange: (phone: string, countryCode: string) => void;
  required?: boolean;
}

export default function PhoneInput({
  value,
  onChange,
  required = false,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // Default to US
  const [phoneNumber, setPhoneNumber] = useState(value);
  const [isValid, setIsValid] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  // Get example placeholder for selected country
  const getPlaceholder = () => {
    try {
      const example = getExampleNumber(selectedCountry.code as any, examples);
      return example ? example.formatNational() : "(555) 123-4567";
    } catch {
      return "(555) 123-4567";
    }
  };

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    try {
      const formatter = new AsYouType(selectedCountry.code as any);
      const formatted = formatter.input(input);

      setPhoneNumber(formatted);
      onChange(formatted, selectedCountry.code);
    } catch {
      // If formatting fails, just use raw input
      setPhoneNumber(input);
      onChange(input, selectedCountry.code);
    }
  };

  // Validate phone number on blur
  const handleBlur = () => {
    setIsFocused(false);

    if (phoneNumber.trim()) {
      try {
        const valid = isValidPhoneNumber(phoneNumber, selectedCountry.code as any);
        setIsValid(valid);
      } catch {
        setIsValid(false);
      }
    } else {
      setIsValid(true); // Empty is valid (handled by required prop)
    }
  };

  // Reset validation when focusing
  const handleFocus = () => {
    setIsFocused(true);
    setIsValid(true);
  };

  // Reformat phone when country changes
  useEffect(() => {
    if (phoneNumber) {
      try {
        const formatter = new AsYouType(selectedCountry.code as any);
        const formatted = formatter.input(phoneNumber);
        setPhoneNumber(formatted);
        onChange(formatted, selectedCountry.code);
      } catch {
        // Keep existing number if reformatting fails
      }
    }
  }, [selectedCountry]);

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== phoneNumber) {
      setPhoneNumber(value);
    }
  }, [value]);

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
    <div className="relative flex items-center">
      {/* Country Selector */}
      <CountrySelector
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
        isValid={isValid}
      />

      {/* Phone Input */}
      <motion.div className="relative flex-1">
        {/*<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />*/}
        <motion.input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          variants={inputVariants}
          initial="initial"
          animate={isFocused ? "focus" : "initial"}
          className={`w-full pl-2 pr-4 py-3 bg-black/50 backdrop-blur-sm border-2 ${
            isValid ? "border-purple-500/50" : "border-red-500/50"
          } border-l-0 rounded-r-lg text-white placeholder-gray-400 focus:outline-none ${
            isValid ? "focus:border-purple-400" : "focus:border-red-400"
          } transition-all duration-300`}
          placeholder={getPlaceholder()}
        />
      </motion.div>

      {/* Validation message */}
      {!isValid && phoneNumber.trim() && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-6 left-0 text-xs text-red-400"
        >
          Invalid phone number
        </motion.div>
      )}
    </div>
  );
}
