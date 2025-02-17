"use client";
import { useEffect, useRef, useState } from "react";
import type React from "react";

import { motion } from "framer-motion";
import gsap from "gsap";
import EmailCapture from "@/components/EmailCapture";

const HeroSection = () => {
  const [isTextRevealed, setIsTextRevealed] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);
  const sparkonomyRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showIgnitingNow, setShowIgnitingNow] = useState<boolean>(true);

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate "IGNITING" letter by letter
    [..."I g n i t i n g"].forEach((letter, index) => {
      tl.fromTo(
        `#letter-igniting-${index}`,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" }
      );
    });

    // Add a small pause between animations
    tl.to({}, { duration: 0.3 });

    // Animate "NOW..." letter by letter
    [..."N o w . . ."].forEach((letter, index) => {
      tl.fromTo(
        `#letter-now-${index}`,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" }
      );
    });

    // Animate the final dot
    tl.to("#final-dot", {
      scale: 1.2,
      opacity: 1,
      repeat: -1,
      duration: 1.6,
      ease: "power2.inOut",
      yoyo: true,
    });

    // Set a timeout to show the content after 3 seconds
    const timer = setTimeout(() => {
      setShowContent(true);
      setShowIgnitingNow(false);
    }, 3000);

    // Animate background
    gsap.to(".bg-animation", {
      backgroundPosition: "100% 100%",
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    return () => {
      tl.kill();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (showContent) {
      const contentTl = gsap.timeline();

      // Animate "sparkonomy" text
      if (sparkonomyRef.current) {
        const chars = sparkonomyRef.current.textContent?.split("") || [];
        sparkonomyRef.current.innerHTML = "";
        chars.forEach((char) => {
          const span = document.createElement("span");
          span.textContent = char;
          span.style.display = "inline-block";
          span.style.opacity = "0";
          sparkonomyRef.current?.appendChild(span);

          contentTl.to(
            span,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: 0.02,
              ease: "power2.out",
            },
            "-=0.4"
          );
        });

        contentTl.to(
          sparkonomyRef.current.children,
          {
            color: "#6C63FF",
            textShadow: "0 0 10px rgba(108,99,255,0.7)",
            duration: 0.5,
            stagger: {
              each: 0.1,
              repeat: -1,
              yoyo: true,
            },
            onUpdate: function (this: gsap.TweenVars) {
              const progress = this.progress();
              const scaleValue = 1 + Math.sin(progress * Math.PI) * 0.1;
              gsap.set(this.targets(), { scale: scaleValue });
            },
          },
          "-=0.5"
        );

        // Add floating animation to "sparkonomy"
        gsap.to(sparkonomyRef.current, {
          y: -10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }

      // Animate tagline
      if (taglineRef.current) {
        const words = taglineRef.current.textContent?.split(" ") || [];
        taglineRef.current.innerHTML = "";
        words.forEach((word, index) => {
          const span = document.createElement("span");
          span.textContent = word + " ";
          span.style.display = "inline-block";
          span.style.opacity = "0";
          span.style.transform = "translateY(20px)";
          taglineRef.current?.appendChild(span);

          contentTl.to(
            span,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: 0.1 * index,
              ease: "power2.out",
            },
            "-=0.4"
          );
        });

        // Add pulsating glow effect to tagline
        gsap.to(taglineRef.current, {
          textShadow: "0 0 15px rgba(108,99,255,0.7)",
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }
    }
  }, [showContent]);

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
      <div
        className="absolute inset-0 pointer-events-none bg-animation"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9InBhdHRlcm4iIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMTA4LCA5OSwgMjU1LCAwLjEpIiAvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIiAvPgo8L3N2Zz4=')",
          backgroundSize: "200% 200%",
          backgroundPosition: "0% 0%",
        }}
      ></div>

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
        <div
          className={`absolute inset-0 flex items-center justify-center mb-12 ${
            showIgnitingNow ? "flex" : "hidden"
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white flex items-center justify-center gap-4">
    <span className="flex">
      {[..."I g n i t i n g"].map((letter, index) => (
        <motion.span
          key={`igniting-${index}`}
          id={`letter-igniting-${index}`}
          className="inline-block"
          style={{
            textShadow: "0 0 10px rgba(108,99,255,0.5)",
          }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
            <span className="flex">
      {[..."N o w . . ."].map((letter, index) => (
        <motion.span
          key={`now-${index}`}
          id={`letter-now-${index}`}
          className="inline-block"
          style={{
            textShadow: "0 0 10px rgba(108,99,255,0.5)",
          }}
          onAnimationEnd={() => setShowContent(true)}
        >
          {letter}
        </motion.span>
      ))}
    </span>
          </h1>
        </div>


        <motion.div
          ref={contentRef}
          initial={{opacity: 0, y: 20}}
          animate={{
            opacity: showContent ? 1 : 0,
            y: showContent ? 0 : 20,
          }}
          transition={{duration: 1, ease: "easeInOut"}}
        >
          <div className="relative">
            <h2
              ref={sparkonomyRef}
              className="text-8xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-normal text-white"
              style={{
                textShadow: "0 0 20px rgba(108,99,255,0.3)",
              }}
            >
              Sparkonomy
            </h2>
          </div>

          <p
            className="tagline text-lg sm:text-xl md:text-2xl mb-12 relative text-white opacity-100"
          >
            Developing AI to spark livelihoods globally
          </p>

          <div className="relative pt-12">
            <EmailCapture/>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
