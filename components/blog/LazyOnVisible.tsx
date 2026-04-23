"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyOnVisibleProps {
  children: ReactNode;
  rootMargin?: string;
  minHeight?: number | string;
}

/**
 * Renders children only after the wrapper enters the viewport (+rootMargin).
 * Used to defer hydration/JS cost of below-fold sections on long pages.
 * The reserved min-height prevents layout shift when children mount.
 */
export default function LazyOnVisible({
  children,
  rootMargin = "300px",
  minHeight,
}: LazyOnVisibleProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={minHeight !== undefined ? { minHeight } : undefined}>
      {visible ? children : null}
    </div>
  );
}
