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
  disabled?: boolean;
  // Override the inner <input>'s className. Defaults to the dark-bg styling
  // (white text + translucent placeholder); override on light backgrounds.
  inputClassName?: string;
  // Override the inner <input>'s autoComplete. Defaults to "tel"; pass "off"
  // (or a non-standard token) to suppress browser saved-number suggestions.
  autoComplete?: string;
}

const DEFAULT_INPUT_CLASS =
  "bg-transparent border-none outline-none text-base placeholder:text-white/60 focus:outline-none focus:ring-0 w-full text-white";

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
  disabled = false,
  inputClassName = DEFAULT_INPUT_CLASS,
  autoComplete = "tel",
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
        disabled={disabled}
        className="validated-phone-input"
        numberInputProps={{
          className: inputClassName,
          disabled,
          name: "phone",
          autoComplete,
          inputMode: "tel",
        }}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};
