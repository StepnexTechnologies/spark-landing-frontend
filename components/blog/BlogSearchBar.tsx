"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogSearchBarProps {
  /** Pre-fill the input (used on the search results page). */
  defaultValue?: string;
  /** Placeholder text. */
  placeholder?: string;
  /** Extra classes for the outer form (controls width/spacing per page). */
  className?: string;
  /** Focus the input on mount (used on the results page). */
  autoFocus?: boolean;
  /**
   * Compact pill (icon + input, no visible submit button) for tight spots like
   * the navbar. Submits on Enter. Defaults to the full bar with a Search button.
   */
  compact?: boolean;
}

/**
 * Compact search input. Submitting navigates to the server-rendered
 * /blogs/search?q=... results page — no client-side fetching here.
 */
export default function BlogSearchBar({
  defaultValue = "",
  placeholder = "Search articles…",
  className,
  autoFocus = false,
  compact = false,
}: BlogSearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/blogs/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className={cn(
        "relative w-full",
        compact ? "max-w-md" : "max-w-2xl mx-auto",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400",
          compact ? "left-3.5" : "left-4"
        )}
      >
        <Search className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </span>
      <input
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search articles"
        autoFocus={autoFocus}
        className={cn(
          "w-full rounded-full border border-gray-200 bg-white/90 text-gray-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100",
          compact ? "py-2 pl-10 pr-4 text-sm" : "py-3 pl-12 pr-28 text-base"
        )}
      />
      {!compact && (
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#DD2A7B] to-[#9747FF] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Search
        </button>
      )}
    </form>
  );
}
