"use client";

import { useEffect, useState } from "react";
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
  // Surface theme. "dark" (default) keeps the white country-arrow + dark
  // dropdown for dark pill backgrounds. "light" switches the arrow to #212529
  // and the dropdown to white text-on-white so it stays visible on light
  // pills (e.g. the promo / earn signup card).
  theme?: "dark" | "light";
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
  theme = "dark",
}: ValidatedPhoneInputProps) => {
  const wrapperClass =
    theme === "light"
      ? "validated-phone-input validated-phone-input--light"
      : "validated-phone-input";
  // react-phone-number-input mutates the input's `value` (injects the country
  // dial prefix, e.g. "+91") and renders the country-flag <select> during
  // initialization, which the server can't reproduce. Render a layout-matching
  // placeholder on SSR + the first client paint, then swap in the real widget
  // after mount so React never sees a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative w-full">
      {mounted ? (
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
          className={wrapperClass}
          numberInputProps={{
            className: inputClassName,
            disabled,
            name: "phone",
            autoComplete,
            inputMode: "tel",
          }}
        />
      ) : (
        <div className={`${wrapperClass} PhoneInput`}>
          {/* Flag slot placeholder — matches the .PhoneInputCountry width so the
              text input lands at the same x-position post-hydration. */}
          <div className="PhoneInputCountry" aria-hidden="true" />
          <input
            id={id}
            type="tel"
            inputMode="tel"
            name="phone"
            autoComplete={autoComplete}
            className={inputClassName}
            placeholder={placeholder}
            value=""
            disabled
            readOnly
          />
        </div>
      )}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};
