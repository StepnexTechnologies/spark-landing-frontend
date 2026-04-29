"use client";

import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  // Optional id; falls back to a slug derived from the label.
  id?: string;
  inputClassName?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, id, className, inputClassName, ...props }, ref) => {
    const inputId = id ?? `text-input-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    return (
      <div className={twMerge("flex flex-col gap-1.5 w-full", className)}>
        <label htmlFor={inputId} className="text-xs font-medium text-white">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={twMerge(
            "w-full rounded-[16px] bg-transparent border border-white px-4 py-3 text-sm text-white placeholder:text-white/80 outline-none focus:border-white transition-colors",
            error && "border-red-500 focus:border-red-500",
            inputClassName,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";

export default TextInput;
