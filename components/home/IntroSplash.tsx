"use client";

import {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import gsap from "gsap";
import {track} from "@/lib/analytics/track";

interface IntroSplashProps {
  active: boolean;
  isDesktopDevice: boolean;
  onInteract: () => void;
  className?: string;
}

export default function IntroSplash({
  active,
  isDesktopDevice,
  onInteract,
  className,
}: IntroSplashProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const intro1StartTime = useRef<number>(0);

  useEffect(() => {
    if (!active) return;

    intro1StartTime.current = performance.now();
    track("hero_stage_1_intro_start");

    const tl = gsap.timeline({
      onComplete: () => {
        setAnimationComplete(true);
        track("hero_stage_1_intro_complete", {
          duration_ms: Math.round(performance.now() - intro1StartTime.current),
        });
      },
    });

    [..."Igniting"].forEach((_, index) => {
      tl.fromTo(
        `#letter-igniting-${index}`,
        {opacity: 0},
        {opacity: 1, duration: 0.11, ease: ""},
      );
    });

    tl.to({}, {duration: 0.2});

    [..."Now..."].forEach((_, index) => {
      tl.fromTo(
        `#letter-now-${index}`,
        {opacity: 0},
        {opacity: 1, duration: 0.11, ease: "easeInOut"},
      );
    });

    return () => {
      tl.kill();
    };
  }, [active]);

  useEffect(() => {
    if (!active || !animationComplete) return;

    const waitStart = performance.now();
    const handleInteraction = (e: Event) => {
      const triggerType =
        e.type === "mousemove"
          ? "mouse"
          : e.type === "touchstart"
            ? "touch"
            : "click";
      track("hero_stage_2_interaction", {
        trigger: triggerType,
        time_to_interact_ms: Math.round(performance.now() - waitStart),
      });
      onInteract();
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [active, animationComplete, onInteract]);

  return (
    <motion.div
      className={`absolute inset-0 flex flex-col space-y-8 items-center justify-center mb-12 ${!active ? "hidden" : ""} ${className ?? ""}`}
      initial={{opacity: 1}}
      animate={{opacity: active ? 1 : 0}}
      transition={{duration: 0.5, ease: "easeInOut"}}
    >
      <h1 className="text-5xl md:text-6xl font-bold text-white flex items-center justify-center gap-4 select-none">
        <span className="flex justify-center items-center w-min">
          {[..."Igniting"].map((letter, index) => (
            <motion.span
              key={`igniting-${index}`}
              id={`letter-igniting-${index}`}
              className="flex w-min justify-center items-center"
              style={{textShadow: "0 0 10px rgba(108,99,255,0.5)"}}
            >
              {letter}
            </motion.span>
          ))}
        </span>
        <span className="flex justify-center items-center w-min">
          {[..."Now..."].map((letter, index) => (
            <motion.span
              key={`now-${index}`}
              id={`letter-now-${index}`}
              className="flex w-min justify-center items-center"
              style={{textShadow: "0 0 10px rgba(108,99,255,0.5)"}}
            >
              {letter}
            </motion.span>
          ))}
        </span>
      </h1>
      <motion.h3
        initial={{opacity: 0}}
        animate={{opacity: animationComplete && active ? 1 : 0}}
        transition={{delay: 2, duration: 1, ease: "easeInOut"}}
      >
        <p className="tagline text-md sm:text-lg md:text-xl mb-12 relative text-zinc-300 select-none">
          It begins with you—
          <span>{isDesktopDevice ? "move to ignite" : "touch to ignite"}.</span>
        </p>
      </motion.h3>
    </motion.div>
  );
}
