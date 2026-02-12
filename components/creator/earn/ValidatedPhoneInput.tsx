"use client";

import PhoneInput from "react-phone-number-input";
import type { Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface ValidatedPhoneInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onCountryChange?: (country: Country) => void;
  error?: string;
  defaultCountry?: Country;
  country?: Country;
  placeholder?: string;
}

export const ValidatedPhoneInput = ({
  id,
  value,
  onChange,
  onBlur,
  onCountryChange,
  error,
  defaultCountry = "IN",
  country,
  placeholder = "Your mobile number",
}: ValidatedPhoneInputProps) => {
  return (
    <div className="relative w-full">
      <PhoneInput
        id={id}
        international
        defaultCountry={defaultCountry}
        country={country}
        value={value}
        onChange={(value) => onChange(value || "")}
        onCountryChange={onCountryChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className="validated-phone-input"
        numberInputProps={{
          className:
            "bg-transparent border-none outline-none text-base placeholder:text-white/60 focus:outline-none focus:ring-0 w-full text-white",
        }}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};
