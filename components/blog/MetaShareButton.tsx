"use client";

import toast from "react-hot-toast";
import { track } from "@/lib/analytics/track";

interface MetaShareButtonProps {
  title: string;
  url: string;
  slug: string;
}

const TRIGGER_CLASS =
  "text-[#999999] hover:text-gray-700 transition-colors";
const TRIGGER_SIZE_CLASS = "w-[18px] h-[18px] md:w-6 md:h-6";

export default function MetaShareButton({
  title,
  url,
  slug,
}: MetaShareButtonProps) {
  const handleShare = async () => {
    track("blog_share_click", { platform: "native", slug });

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if ((err as DOMException)?.name === "AbortError") return;
      }
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't share link");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share this post"
      className={`ml-auto ${TRIGGER_CLASS}`}
    >
      <svg
        className={TRIGGER_SIZE_CLASS}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    </button>
  );
}
