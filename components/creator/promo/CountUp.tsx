"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

interface CountUpProps {
  to: number;
  duration?: number;
  delay?: number;
  // When false, sits at 0 and waits. The tween starts the moment this flips
  // true so callers can defer the count-up until the surrounding card is
  // actually on-screen.
  play?: boolean;
}

// Tweens an integer from 0 → `to`. Renders just the number — wrap it in
// whatever surrounding markup (₹ prefix, spans, etc.) the caller needs.
export default function CountUp({ to, duration = 1.4, delay = 0, play = true }: CountUpProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!play) return;
    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [to, duration, delay, play]);

  return <>{value}</>;
}
