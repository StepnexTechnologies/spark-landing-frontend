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
  const [showIgnitingNow, setShowIgnitingNow] = useState<boolean>(true);
  const [isInitialAnimationComplete, setIsInitialAnimationComplete] =
    useState(false);
  const [isDesktopDevice, setIsDesktopDevice] = useState(true); // Default to desktop

  const containerRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);
  const sparkonomyRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // const splatInterval = useRef<NodeJS.Timeout | null>(null);
  // const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  //
  // const startSplats = () => {
  //   if (!splatInterval.current) {
  //     splatInterval.current = setInterval(() => {
  //       if (simulationInstance && showContent && document.visibilityState === "visible") {
  //         simulationInstance.multipleSplats(Math.random() * (5 - 2) + 2); // Random splats between 2 and 5
  //       }
  //     }, 5000);
  //   }
  // };
  //
  // const stopSplats = () => {
  //   if (splatInterval.current) {
  //     clearInterval(splatInterval.current);
  //     splatInterval.current = null;
  //   }
  // };
  //
  // const resetInactivityTimer = () => {
  //   if (inactivityTimer.current) {
  //     clearTimeout(inactivityTimer.current);
  //   }
  //   stopSplats(); // Stop splats immediately on interaction
  //
  //   inactivityTimer.current = setTimeout(() => {
  //     startSplats(); // Start splats after 5 seconds of inactivity
  //   }, 5000);
  // };
  //
  // useEffect(() => {
  //   // User activity events to reset the inactivity timer
  //   const handleUserActivity = () => resetInactivityTimer();
  //
  //   window.addEventListener("mousemove", handleUserActivity);
  //   window.addEventListener("keydown", handleUserActivity);
  //   window.addEventListener("click", handleUserActivity);
  //   window.addEventListener("scroll", handleUserActivity);
  //   window.addEventListener("touchstart", handleUserActivity);
  //
  //   // Start inactivity timer when component mounts
  //   resetInactivityTimer();
  //
  //   return () => {
  //     stopSplats();
  //     if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
  //     window.removeEventListener("mousemove", handleUserActivity);
  //     window.removeEventListener("keydown", handleUserActivity);
  //     window.removeEventListener("click", handleUserActivity);
  //     window.removeEventListener("scroll", handleUserActivity);
  //     window.removeEventListener("touchstart", handleUserActivity);
  //   };
  // }, []);

  // Device detection - run once on component mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Start with desktop assumption (the default state is already true)
    let isDesktop = true;

    // Then check explicitly for mobile indicators in user agent
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      isDesktop = false;
    }

    // Set the state based on detection
    setIsDesktopDevice(isDesktop);

    // Add diagnostic classes to body for potential CSS targeting and debugging
    if (isDesktop) {
      document.body.classList.add("desktop-device");
      document.body.classList.remove("mobile-device");
    } else {
      document.body.classList.add("mobile-device");
      document.body.classList.remove("desktop-device");
    }

    console.log(
      "Device detected as:",
      isDesktop ? "desktop/laptop" : "mobile/tablet"
    );
    console.log("User agent:", navigator.userAgent);
  }, []);

  // Explicit text setting via DOM after render - backup approach
  useEffect(() => {
    const updateMoveText = () => {
      const moveTextElement = document.getElementById("moveText");
      if (!moveTextElement) return;

      const textContent = isDesktopDevice
        ? "move to ignite"
        : "touch to ignite";

      // Only update if different to avoid unnecessary DOM manipulation
      if (moveTextElement.textContent !== textContent) {
        moveTextElement.textContent = textContent;
        console.log("Text forcibly updated to:", textContent);
      }
    };

    // Update immediately and after a short delay to handle any race conditions
    updateMoveText();
    const timeoutId = setTimeout(updateMoveText, 500);

    return () => clearTimeout(timeoutId);
  }, [isDesktopDevice]);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          setIsInitialAnimationComplete(true);
        }, 500);
      },
    });

    // Animate "IGNITING" letter by letter with chained timing
    [..."I g n i t i n g"].forEach((letter, index) => {
      tl.fromTo(
        `#letter-igniting-${index}`,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.08,
          ease: "power1.out",
        },
        "+=0.02" // Small delay between each letter
      );
    });

    // Add a small pause between word animations
    tl.to({}, { duration: 0.2 });

    // Animate "NOW..." letter by letter with chained timing
    [..."N o w . . ."].forEach((letter, index) => {
      tl.fromTo(
        `#letter-now-${index}`,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.08,
          ease: "power1.out",
        },
        "+=0.02" // Small delay between each letter
      );
    });

    // Animate the final dot
    tl.to("#final-dot", {
      scale: 1.2,
      opacity: 1,
      repeat: 3,
      duration: 0.8,
      ease: "power2.inOut",
      yoyo: true,
    });

    // Animate background
    gsap.to(".bg-animation", {
      backgroundPosition: "100% 100%",
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (isInitialAnimationComplete && !showContent) {
      const handleInteraction = () => {
        setShowContent(true);
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
    }
  }, [isInitialAnimationComplete, showContent]);

  useEffect(() => {
    if (showContent) {
      setShowIgnitingNow(false);

      const contentTl = gsap.timeline();
      const simulationInstance = (
        window as unknown as Window & { fluidSimulation: any }
      ).fluidSimulation;
      if (simulationInstance) {
        simulationInstance.multipleSplats(10);
      }

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
        });

        // Animate each letter with smooth, sequential timing
        contentTl.to(sparkonomyRef.current.children, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.03, // Small stagger between letters
          ease: "power1.out",
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
          "+=0.1"
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

  const handleUserInteraction = (e: React.MouseEvent) => {
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
      onMouseMove={handleUserInteraction}
      onClick={handleUserInteraction}
      className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden bg-none pointer-events-none"
    >
      <div className="absolute inset-0-none">
        <motion.div
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
        <motion.div
          className={`absolute inset-0 flex flex-col space-y-8 items-center justify-center mb-12`}
          initial={{ opacity: 1 }}
          animate={{ opacity: showIgnitingNow ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white flex items-center justify-center gap-4 select-none">
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
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </h1>
          {
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isInitialAnimationComplete ? 1 : 0,
                y: isInitialAnimationComplete ? 0 : 20,
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <p className="tagline text-md sm:text-lg md:text-xl mb-12 relative text-zinc-300 opacity-100 select-none">
                It begins with you—<span id="moveText">move to ignite</span>.
              </p>
            </motion.h3>
          }
        </motion.div>

        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: showContent ? 1 : 0,
            y: showContent ? 0 : 20,
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <div className="relative px-4 w-full flex justify-center">
            <h2
              ref={sparkonomyRef}
              className="text-4xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-normal text-white select-none whitespace-nowrap"
              style={{
                textShadow: "0 0 20px rgba(108,99,255,0.3)",
              }}
            >
              Sparkonomy
            </h2>
          </div>

          <p
            className="tagline text-lg sm:text-xl md:text-2xl mb-12 relative text-white opacity-100 select-none px-4"
          >
            Developing AI to spark livelihoods globally
          </p>

          <div className="relative pointer-events-auto">
            {showContent && <EmailCapture />}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
