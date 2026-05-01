"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

interface CountUpProps {
  to: number;
  duration?: number;
  delay?: number;
}

// Tweens an integer from 0 → `to`. Renders just the number — wrap it in
// whatever surrounding markup (₹ prefix, spans, etc.) the caller needs.
export default function CountUp({ to, duration = 1.4, delay = 0 }: CountUpProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [to, duration, delay]);

  return <>{value}</>;
}
