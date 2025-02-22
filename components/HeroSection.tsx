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
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [showPromptLine, setShowPromptLine] = useState(false);
  const [allowInteraction, setAllowInteraction] = useState(false);

  // States for sequential lazy loading
  const [titleVisible, setTitleVisible] = useState(false);
  const [subtextVisible, setSubtextVisible] = useState(false);
  const [emailCaptureVisible, setEmailCaptureVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);
  const sparkonomyRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
        // "Igniting Now..." animation is complete
        setIsInitialAnimationComplete(true);
        // Only allow interaction after animation completes
        setAllowInteraction(true);
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

  // Track user interactions, but only after interaction is allowed
  useEffect(() => {
    if (!allowInteraction) return;

    const handleUserInteraction = () => {
      setUserHasInteracted(true);
    };

    window.addEventListener("mousemove", handleUserInteraction, { once: true });
    window.addEventListener("click", handleUserInteraction, { once: true });
    window.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });

    return () => {
      window.removeEventListener("mousemove", handleUserInteraction);
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, [allowInteraction]);

  // Decide what to show after initial animation completes
  useEffect(() => {
    if (isInitialAnimationComplete) {
      if (userHasInteracted) {
        // User has already interacted, skip the prompt and show content
        setShowContent(true);
        setShowIgnitingNow(false);
        setShowPromptLine(false);
      } else {
        // User hasn't interacted yet, show the prompt line
        setShowPromptLine(true);

        // Setup interaction listeners to show content when user interacts
        const showContentOnInteraction = () => {
          setShowContent(true);
          setShowIgnitingNow(false);
          setShowPromptLine(false);

          window.removeEventListener("mousemove", showContentOnInteraction);
          window.removeEventListener("click", showContentOnInteraction);
          window.removeEventListener("touchstart", showContentOnInteraction);
        };

        window.addEventListener("mousemove", showContentOnInteraction);
        window.addEventListener("click", showContentOnInteraction);
        window.addEventListener("touchstart", showContentOnInteraction);

        return () => {
          window.removeEventListener("mousemove", showContentOnInteraction);
          window.removeEventListener("click", showContentOnInteraction);
          window.removeEventListener("touchstart", showContentOnInteraction);
        };
      }
    }
  }, [isInitialAnimationComplete, userHasInteracted]);

  // Animate the prompt line
  useEffect(() => {
    if (showPromptLine) {
      const promptLineElement = document.getElementById("promptLine");
      if (promptLineElement) {
        gsap.fromTo(
          promptLineElement,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          }
        );

        // Add a pulsing animation to the "move to ignite" text
        const moveTextElement = document.getElementById("moveText");
        if (moveTextElement) {
          gsap.to(moveTextElement, {
            scale: 1.05,
            textShadow: "0 0 8px rgba(255,255,255,0.8)",
            color: "#ffffff",
            delay: 0.5,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          });
        }
      }
    }
  }, [showPromptLine]);

  // Sequential lazy loading animation when content should be shown
  useEffect(() => {
    if (showContent) {
      // Trigger fluid simulation if available
      const simulationInstance = (
        window as unknown as Window & { fluidSimulation: any }
      ).fluidSimulation;
      if (simulationInstance) {
        simulationInstance.multipleSplats(10);
      }

      // Sequential loading with delays
      // First show the title
      setTitleVisible(true);

      // After 1 second, show the subtext
      const subtextTimer = setTimeout(() => {
        setSubtextVisible(true);

        // After another 1 second, show the email capture
        const emailTimer = setTimeout(() => {
          setEmailCaptureVisible(true);
        }, 1000);

        return () => clearTimeout(emailTimer);
      }, 1000);

      return () => clearTimeout(subtextTimer);
    }
  }, [showContent]);

  // Apply animations to title when it becomes visible
  useEffect(() => {
    if (titleVisible && sparkonomyRef.current) {
      const contentTl = gsap.timeline();

      // Apply animations to the title
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
        stagger: 0.03,
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
  }, [titleVisible]);

  // Apply smooth animation to tagline when it becomes visible
  useEffect(() => {
    if (subtextVisible && taglineRef.current) {
      // Smoothly animate in the tagline
      gsap.fromTo(
        taglineRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        }
      );
    }
  }, [subtextVisible]);

  // Apply smooth animation to email capture when it becomes visible
  useEffect(() => {
    if (emailCaptureVisible) {
      const emailContainer = document.querySelector(".email-container");
      if (emailContainer) {
        gsap.fromTo(
          emailContainer,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }
        );
      }
    }
  }, [emailCaptureVisible]);

  const handleUserInteraction = (e: React.MouseEvent) => {
    // Only process mouse interactions if allowed
    if (!allowInteraction) return;

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
      className={`flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden bg-none ${
        allowInteraction ? "pointer-events-auto" : "pointer-events-none"
      }`}
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
              id="promptLine"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: showPromptLine ? 1 : 0,
                y: showPromptLine ? 0 : 20,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p className="tagline text-md sm:text-lg md:text-xl mb-12 relative text-zinc-300 opacity-100 select-none">
                It begins with you—
                <span id="moveText">
                  {isDesktopDevice ? "move to ignite" : "touch to ignite"}
                </span>
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
          <div
            className="relative px-4 w-full flex justify-center transition-opacity duration-700"
            style={{ opacity: titleVisible ? 1 : 0 }}
          >
            <h2
              ref={sparkonomyRef}
              className="text-5xl xs:text-5xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-6 tracking-normal text-white select-none whitespace-nowrap"
              style={{
                textShadow: "0 0 20px rgba(108,99,255,0.3)",
              }}
            >
              Sparkonomy
            </h2>
          </div>

          <p
            ref={taglineRef}
            className="tagline text-lg sm:text-xl md:text-2xl mb-12 relative text-white select-none px-4 transition-opacity duration-700"
            style={{
              opacity: subtextVisible ? 1 : 0,
              transform: subtextVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Developing AI to spark livelihoods globally
          </p>

          <div
            className="relative pointer-events-auto transition-all duration-700 email-container"
            style={{
              opacity: emailCaptureVisible ? 1 : 0,
              transform: emailCaptureVisible
                ? "translateY(0)"
                : "translateY(20px)",
            }}
          >
            {showContent && <EmailCapture />}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
