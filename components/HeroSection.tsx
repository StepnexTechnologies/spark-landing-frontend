"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import EmailCapture from "@/components/EmailCapture";
import Footer from "@/components/Footer";

const ParticleEffect = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-300/30"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

const HeroSection = () => {
  const [isTextRevealed, setIsTextRevealed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const text = "IGNITING NOW...";
    const tl = gsap.timeline();
    [...text].forEach((letter, index) => {
      tl.fromTo(
        `#letter-${index}`,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.1 }
      );
    });

    tl.to("#final-dot", {
      scale: 1.2,
      opacity: 0.8,
      repeat: -1,
      duration: 1.5,
      yoyo: true,
      ease: "power2.inOut",
    });

    gsap.to(".title-container", {
      scale: 1.02,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    return () => {
      tl.kill();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });

      if (!isTextRevealed) {
        setIsTextRevealed(true);
      }

      if (sparkRef.current) {
        gsap.to(sparkRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    }
  };

  return (
    <motion.section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden"
    >
      <ParticleEffect />

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="w-full h-full"
          animate={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${
              mousePosition.y * 100
            }%, rgba(108,99,255,0.2), transparent 50%), 
                        radial-gradient(circle at ${
                          100 - mousePosition.x * 100
                        }% ${
              100 - mousePosition.y * 100
            }%, rgba(108,99,255,0.1), transparent 30%)`,
          }}
          transition={{ type: "tween", duration: 0.2 }}
        />
      </div>

      <div
        ref={sparkRef}
        className="fixed pointer-events-none z-50 mix-blend-screen"
        style={{ left: -20, top: -20 }}
      >
        <motion.div
          className="w-10 h-10 rounded-full bg-[radial-gradient(circle,rgba(108,99,255,0.3)_0%,transparent_70%)]"
          animate={{
            scale: 1.2,
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="text-center relative z-10">
        <div className="title-container relative">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-wide">
            {[..."IGNITING NOW..."].map((letter, index) => (
              <motion.span
                key={index}
                id={`letter-${index}`}
                className="inline-block"
                whileHover={{
                  scale: 1.2,
                  color: "#6C63FF",
                  transition: { duration: 0.2 },
                }}
                style={{
                  textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        </div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: isTextRevealed ? 1 : 0.3,
            scale: isTextRevealed ? 1 : 0.9,
          }}
          whileHover={{ scale: 1.05 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 uppercase tracking-wider"
          style={{
            textShadow: "0 0 20px rgba(108,99,255,0.3)",
          }}
        >
          <span className="relative inline-block">
            sparkonomy
            <motion.div
              className="absolute -inset-4 bg-purple-500/20 blur-xl -z-10"
              animate={{
                opacity: 0.3,
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isTextRevealed ? 1 : 0,
            y: isTextRevealed ? 0 : 20,
          }}
          transition={{ delay: 0.3 }}
          className="text-lg sm:text-xl md:text-2xl mb-12 relative"
        >
          <span className="relative inline-block">
            Developing AI to spark livelihoods globally
            <motion.div
              className="absolute -inset-2 bg-purple-500/10 blur-lg -z-10"
              animate={{
                scale: 1.1,
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </span>
        </motion.p>

        <EmailCapture />
      </div>

      <Footer />
    </motion.section>
  );
};

export default HeroSection;
