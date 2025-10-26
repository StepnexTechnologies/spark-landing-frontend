"use client";

import React, {useCallback, useEffect, useState} from "react";
import FloatingHeart from "./FloatingHeart";

interface Heart {
  id: string;
  delay: number;
}

interface FloatingHeartsProps {
  triggerCount: number;
}

export default function FloatingHearts({ triggerCount }: FloatingHeartsProps) {
  const [hearts, setHearts] = useState<Heart[]>([]);

  // Remove completed hearts
  const handleHeartComplete = useCallback((id: string) => {
    setHearts((prev) => prev.filter((heart) => heart.id !== id));
  }, []);

  // Spawn new hearts when triggerCount changes
  useEffect(() => {
    if (triggerCount > 0) {
      const newHearts: Heart[] = [];
      const heartsToSpawn = 5 + Math.floor(Math.random() * 4); // 5-8 hearts

      for (let i = 0; i < heartsToSpawn; i++) {
        newHearts.push({
          id: `heart-${triggerCount}-${i}-${Date.now()}`,
          delay: i * 0.08, // Stagger by 0.08s for faster spawn
        });
      }

      setHearts((prev) => [...prev, ...newHearts]);
    }
  }, [triggerCount]);

  return (
    <div className="absolute bottom-4 right-14 pointer-events-none z-50">
      {hearts.map((heart) => (
        <FloatingHeart
          key={heart.id}
          id={heart.id}
          delay={heart.delay}
          onComplete={handleHeartComplete}
        />
      ))}
    </div>
  );
}
