"use client";

import { useRef } from "react";

export type OtpInputVariant = "dark" | "light";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  variant?: OtpInputVariant;
}

const VARIANT_INPUT_CLASS: Record<OtpInputVariant, string> = {
  dark:
    "w-12 h-14 md:w-14 md:h-14 rounded-lg text-xl md:text-2xl font-semibold bg-white/10 border border-white/20 text-white focus:border-white/60 focus:bg-white/15",
  light:
    "w-[51.5px] h-12 md:w-[55px] md:h-12 rounded-xl text-2xl md:text-[28px] font-bold shadow-[0_2px_6px_rgba(129,52,165,0.15)]",
};

const PROMO_GRADIENT =
  "linear-gradient(322.94deg, #DD2A7B -4.16%, #9747FF 48.14%, #334CCA 122.6%)";

const VARIANT_INPUT_STYLE: Partial<Record<OtpInputVariant, React.CSSProperties>> = {
  light: {
    border: "2px solid transparent",
    backgroundImage: `${PROMO_GRADIENT}, linear-gradient(#fff, #fff), ${PROMO_GRADIENT}`,
    backgroundClip: "text, padding-box, border-box",
    WebkitBackgroundClip: "text, padding-box, border-box",
    backgroundOrigin: "border-box",
    WebkitTextFillColor: "transparent",
  },
};

export default function OtpInput({
  length = 4,
  value,
  onChange,
  autoFocus = false,
  disabled = false,
  variant = "dark",
}: OtpInputProps) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const digits = value.padEnd(length, " ").slice(0, length).split("");

  const setAt = (index: number, ch: string) => {
    const next = digits.slice();
    next[index] = ch || " ";
    onChange(next.join("").replace(/ /g, ""));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, length - 1);
    inputs.current[focusIdx]?.focus();
  };

  const variantClass = VARIANT_INPUT_CLASS[variant];
  const variantStyle = VARIANT_INPUT_STYLE[variant];

  return (
    <div className="flex items-center justify-center gap-2 md:gap-3" onPaste={handlePaste}>
      {digits.map((d, i) => {
        const ch = d.trim();
        return (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            autoFocus={autoFocus && i === 0}
            disabled={disabled}
            value={ch}
            onChange={(e) => {
              const nextCh = e.target.value.replace(/\D/g, "").slice(-1);
              setAt(i, nextCh);
              if (nextCh && i < length - 1) {
                inputs.current[i + 1]?.focus();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !ch && i > 0) {
                inputs.current[i - 1]?.focus();
              }
              if (e.key === "ArrowLeft" && i > 0) {
                inputs.current[i - 1]?.focus();
              }
              if (e.key === "ArrowRight" && i < length - 1) {
                inputs.current[i + 1]?.focus();
              }
            }}
            className={`text-center outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClass}`}
            style={variantStyle}
            aria-label={`OTP digit ${i + 1}`}
          />
        );
      })}
    </div>
  );
}
