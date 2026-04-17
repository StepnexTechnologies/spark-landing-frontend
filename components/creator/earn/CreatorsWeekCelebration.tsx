"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// --- Confetti Particle ---
interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  delay: number;
  duration: number;
  drift: number;
  shape: "circle" | "rect" | "star";
}

const CONFETTI_COLORS = [
  "#FF69B4", "#FF1493", "#FF85C8", "#FFB6C1", "#FFC0CB",
  "#FFD700", "#FFA500", "#FF6347", "#9370DB", "#00CED1",
  "#7FFF00", "#FF4500", "#DA70D6", "#EE82EE", "#F0E68C",
];

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80, // spread across screen (10%-90%)
    y: 0,
    rotation: Math.random() * 720 - 360,
    scale: 0.5 + Math.random() * 1,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 0.4,
    duration: 1.5 + Math.random() * 1.5,
    drift: (Math.random() - 0.5) * 300,
    shape: (["circle", "rect", "star"] as const)[Math.floor(Math.random() * 3)],
  }));
}

function ConfettiParticle({ piece }: { piece: ConfettiPiece }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${piece.x}%`,
        bottom: "10%",
        width: piece.shape === "circle" ? 10 : 12,
        height: piece.shape === "circle" ? 10 : 8,
        borderRadius: piece.shape === "circle" ? "50%" : piece.shape === "rect" ? "2px" : "0",
        backgroundColor: piece.color,
        clipPath: piece.shape === "star"
          ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
          : undefined,
      }}
      initial={{
        y: 0,
        x: 0,
        scale: 0,
        rotate: 0,
        opacity: 1,
      }}
      animate={{
        y: -(300 + Math.random() * 500),
        x: piece.drift,
        scale: piece.scale,
        rotate: piece.rotation,
        opacity: [1, 1, 1, 0],
      }}
      transition={{
        duration: piece.duration,
        delay: piece.delay,
        ease: "easeOut",
      }}
    />
  );
}

// --- Gift Box ---
function GiftBox({
  phase,
  onBurst,
}: {
  phase: "waiting" | "shaking" | "burst" | "done";
  onBurst: () => void;
}) {
  useEffect(() => {
    if (phase === "burst") {
      onBurst();
    }
  }, [phase, onBurst]);

  return (
    <motion.div
      className="absolute bottom-8 left-0 right-0 z-30 flex justify-center"
      initial={{ y: 200 }}
      animate={
        phase === "waiting"
          ? { y: 0 }
          : phase === "shaking"
          ? { y: 0 }
          : { y: 0, scale: 0, opacity: 0 }
      }
      transition={
        phase === "waiting"
          ? { duration: 0.5, ease: "easeOut" }
          : phase === "burst"
          ? { duration: 0.3 }
          : { duration: 0.1 }
      }
    >
      <motion.div
        animate={
          phase === "shaking"
            ? {
                rotate: [-3, 3, -3, 3, -5, 5, -8, 8, 0],
                scale: [1, 1.02, 1, 1.02, 1.05, 1, 1.08, 1, 1.1],
              }
            : {}
        }
        transition={
          phase === "shaking"
            ? { duration: 0.8, ease: "easeInOut" }
            : {}
        }
        className="relative"
      >
        {/* Box body */}
        <div
          className="w-20 h-16 sm:w-24 sm:h-20 rounded-md relative"
          style={{
            background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
            boxShadow: "0 4px 20px rgba(255,20,147,0.5)",
          }}
        >
          {/* Ribbon vertical */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-full bg-yellow-400/80" />
          {/* Ribbon horizontal */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-3 bg-yellow-400/80" />
        </div>
        {/* Lid */}
        <motion.div
          className="absolute -top-4 left-1/2 w-24 h-5 sm:w-28 sm:h-6 rounded-sm"
          style={{
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #FF85C8 0%, #FF1493 100%)",
            boxShadow: "0 -2px 10px rgba(255,20,147,0.3)",
            transformOrigin: "left bottom",
          }}
          animate={
            phase === "burst"
              ? { rotate: -60, y: -80, opacity: 0 }
              : {}
          }
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Bow */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-0">
            <div
              className="w-4 h-5 rounded-full"
              style={{
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                transform: "rotate(-20deg)",
              }}
            />
            <div
              className="w-4 h-5 rounded-full"
              style={{
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                transform: "rotate(20deg)",
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// --- Main Component ---
export default function CreatorsWeekCelebration() {
  const [phase, setPhase] = useState<"hidden" | "box-enter" | "shaking" | "burst" | "text" | "done">("hidden");
  const [dismissed, setDismissed] = useState(false);
  const [canDismiss, setCanDismiss] = useState(false);
  const [confetti, setConfetti] = useState(() => generateConfetti(150));

  const startAnimation = useCallback(() => {
    setDismissed(false);
    setCanDismiss(false);
    setConfetti(generateConfetti(150));
    setPhase("hidden");

    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setPhase("box-enter"), 100));
    timers.push(setTimeout(() => setPhase("shaking"), 600));
    timers.push(setTimeout(() => setPhase("burst"), 1400));
    timers.push(setTimeout(() => setPhase("text"), 1600));
    // Allow dismiss after balloon text animation completes (~1.6s + 0.8s entry + 20 letters * 0.05s = ~3.4s)
    timers.push(setTimeout(() => setCanDismiss(true), 3500));

    return () => timers.forEach(clearTimeout);
  }, []);

  // Play on mount
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    timers.push(setTimeout(() => setPhase("box-enter"), 1000));
    timers.push(setTimeout(() => setPhase("shaking"), 1500));
    timers.push(setTimeout(() => setPhase("burst"), 2300));
    timers.push(setTimeout(() => setPhase("text"), 2500));
    // Allow dismiss after balloon text animation completes (~2.5s + 0.8s entry + 20 letters * 0.05s = ~4.3s)
    timers.push(setTimeout(() => setCanDismiss(true), 4500));

    return () => timers.forEach(clearTimeout);
  }, []);

  // Auto-dismiss 4 seconds after image appears
  useEffect(() => {
    if (phase === "text") {
      const timer = setTimeout(() => {
        setPhase("done");
        setTimeout(() => setDismissed(true), 500);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Ctrl+Shift+R to replay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "R") {
        e.preventDefault();
        startAnimation();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startAnimation]);

  const handleBurst = useCallback(() => {}, []);

  const handleDismiss = useCallback(() => {
    if (!canDismiss) return;
    setPhase("done");
    setTimeout(() => setDismissed(true), 500);
  }, [canDismiss]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {phase !== "done" && phase !== "hidden" && (
        <motion.div
          className={`fixed inset-0 z-[100] flex items-center justify-center ${canDismiss ? "cursor-pointer" : ""}`}
          onClick={handleDismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Confetti layer */}
          {(phase === "burst" || phase === "text") && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {confetti.map((piece) => (
                <ConfettiParticle key={piece.id} piece={piece} />
              ))}
            </div>
          )}

          {/* Gift Box */}
          {(phase === "box-enter" || phase === "shaking" || phase === "burst") && (
            <GiftBox
              phase={
                phase === "box-enter"
                  ? "waiting"
                  : phase === "shaking"
                  ? "shaking"
                  : "burst"
              }
              onBurst={handleBurst}
            />
          )}

          {/* Promo Image */}
          {phase === "text" && (
            <motion.div
              className="relative z-40 flex flex-col items-center px-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src="/images/creator/earn/PROMO-3.png"
                alt="Creators Week Celebration"
                width={600}
                height={600}
                className="max-w-[90vw] max-h-[70vh] w-auto h-auto object-contain mix-blend-lighten"
                priority
              />

            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
