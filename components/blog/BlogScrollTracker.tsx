"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics/track";

const MILESTONES = [25, 50, 75, 100] as const;

interface BlogScrollTrackerProps {
  slug: string;
  author?: string;
  category?: string;
}

export default function BlogScrollTracker({
  slug,
  author,
  category,
}: BlogScrollTrackerProps) {
  const fired = useRef<Set<number>>(new Set());
  const viewFired = useRef(false);

  useEffect(() => {
    if (!viewFired.current) {
      viewFired.current = true;
      track("blog_post_view", {
        slug,
        author: author ?? null,
        category: category ?? null,
      });
    }
  }, [slug, author, category]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      if (scrollHeight <= 0) return;
      const percent = Math.min(100, Math.round((scrollTop / scrollHeight) * 100));

      for (const milestone of MILESTONES) {
        if (percent >= milestone && !fired.current.has(milestone)) {
          fired.current.add(milestone);
          track("blog_scroll_depth", { depth: milestone, slug });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);

  return null;
}
