import type {Config} from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        aurora: "aurora 15s ease infinite",
        "aurora-delayed": "aurora 15s ease infinite -5s",
        shimmer: "shimmer 2s infinite linear",
        // Shared sweep used by the promo card + its CTA so they stay locked
        // in phase (CSS keyframes are wall-clock synced).
        "shimmer-sweep": "shimmer-sweep 4.6s infinite",
        "floater-hue": "floater-hue 8s ease-in-out infinite",
        "urgency-flicker": "urgency-flicker 4.5s ease-in-out infinite",
        "coin-flip": "coin-flip 2.5s linear infinite",
        "coin-twinkle": "coin-twinkle 2.5s linear infinite",
        "coin-shine": "coin-shine 2.5s ease-in-out infinite",
        // Hard on/off blink for the synthetic OTP caret. The OTP inputs use
        // bg-clip text + WebkitTextFillColor: transparent for the gradient
        // digits, which hides the native caret — we draw our own bar and
        // blink it here.
        "caret-blink": "caret-blink 1s steps(2, start) infinite",
      },
      keyframes: {
        aurora: {
          "0%": { transform: "translateX(-100%) skewX(-10deg)" },
          "50%": { transform: "translateX(100%) skewX(-10deg)" },
          "100%": { transform: "translateX(-100%) skewX(-10deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        // 0–70% of the cycle (≈3.2s of 4.6s) sweeps left → right with ease-in-out;
        // 70–100% holds off-screen so the gap matches the prior 1.4s repeatDelay.
        "shimmer-sweep": {
          "0%": { left: "-60%", animationTimingFunction: "ease-in-out" },
          "70%": { left: "100%", animationTimingFunction: "linear" },
          "100%": { left: "100%" },
        },
        "floater-hue": {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
        // Mostly-dark text with two quick light flashes near the end of each cycle.
        "urgency-flicker": {
          "0%, 85%, 100%": { color: "#3D1A4F", textShadow: "none" },
          "88%, 94%": { color: "#FFFFFF", textShadow: "0 0 6px rgba(255,255,255,0.55)" },
          "91%, 97%": { color: "#3D1A4F", textShadow: "none" },
        },
        "coin-flip": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        "coin-twinkle": {
          "0%, 78%": { opacity: "0", transform: "scale(0) rotate(0deg)" },
          "88%": { opacity: "1", transform: "scale(1.1) rotate(35deg)" },
          "100%": { opacity: "0", transform: "scale(0.4) rotate(70deg)" },
        },
        "coin-shine": {
          "0%, 100%": { opacity: "0.95", transform: "scale(1.08)" },
          "50%": { opacity: "0.35", transform: "scale(0.92)" },
        },
        "caret-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: '#8134a5',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [
    animatePlugin,
    function ({ addUtilities }: any) {
      addUtilities({
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
};

export default config;
