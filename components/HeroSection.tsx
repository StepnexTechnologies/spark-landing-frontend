import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import EmailCapture from "@/components/EmailCapture";

const HeroSection = () => {
  const [isTextRevealed, setIsTextRevealed] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showIgnitingNow, setShowIgnitingNow] = useState(true);
  const [isInitialAnimationComplete, setIsInitialAnimationComplete] =
    useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isSpacedText, setIsSpacedText] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);
  const sparkonomyRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Detect device type and screen size
  useEffect(() => {
    const updateDisplayText = () => {
      const isTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0;
      const isLargeScreen = window.innerWidth >= 1024;

      if (isTouchDevice && !isLargeScreen) {
        setDisplayText("Touch To Ignite");
        setIsSpacedText(false);
      } else {
        setDisplayText("Move To Ignite");
        setIsSpacedText(true);
      }
    };

    updateDisplayText();
    window.addEventListener("resize", updateDisplayText);

    return () => {
      window.removeEventListener("resize", updateDisplayText);
    };
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          setIsInitialAnimationComplete(true);
        }, 500);
      },
    });

    // Create a smoother animation sequence for letters
    const words = displayText.split(" ");
    let letterIndex = 0;

    words.forEach((word, wordIndex) => {
      [...word].forEach(() => {
        tl.fromTo(
          `#letter-${letterIndex}`,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6, // Increased duration for smoother animation
            ease: "power1.out", // Changed to smoother easing
            stagger: 0.05, // Added stagger for more consistent timing
          },
          "-=0.35" // Overlap animations slightly for smoother flow
        );
        letterIndex++;
      });

      if (wordIndex < words.length - 1) {
        letterIndex++;
      }
    });

    return () => {
      tl.kill();
    };
  }, [displayText]);

  useEffect(() => {
    if (isInitialAnimationComplete && !showContent) {
      const handleInteraction = () => {
        setShowContent(true);
        setShowIgnitingNow(false);
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
    if (showContent && sparkonomyRef.current) {
      const text = "Sparkonomy";
      sparkonomyRef.current.innerHTML = "";

      [...text].forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.opacity = "0";
        span.style.display = "inline-block";
        sparkonomyRef.current?.appendChild(span);

        gsap.to(span, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power2.out",
          onComplete: () => {
            if (index === text.length - 1) {
              gsap.to(sparkonomyRef.current!.children, {
                color: "#6C63FF",
                textShadow: "0 0 20px rgba(108,99,255,0.7)",
                duration: 0.8,
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
              });
            }
          },
        });
      });

      // Smoother floating animation
      gsap.to(sparkonomyRef.current, {
        y: -10,
        duration: 2.5, // Slightly longer duration
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut", // Smoother easing
      });
    }
  }, [showContent]);

  useEffect(() => {
    if (showContent && taglineRef.current) {
      const text = "Developing AI to spark livelihoods globally";
      taglineRef.current.innerHTML = "";

      [...text].forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.opacity = "0";
        span.style.display = "inline-block";
        taglineRef.current?.appendChild(span);

        gsap.to(span, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: index * 0.05,
          ease: "power2.out",
        });
      });
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
      <div className="absolute inset-0">
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
          className="w-full h-full"
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

      <div className="text-center relative z-10 w-full max-w-6xl mx-auto px-4">
        <motion.div
          className="flex flex-col items-center justify-center mb-12"
          initial={{ opacity: 1 }}
          animate={{ opacity: showIgnitingNow ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white flex flex-wrap justify-center select-none tracking-widest px-2">
            {(() => {
              const words = displayText.split(" ");
              let letterIndex = 0;

              return words.map((word, wordIndex) => (
                <React.Fragment key={`word-${wordIndex}`}>
                  <span className="flex">
                    {[...word].map((letter) => {
                      const currentIndex = letterIndex++;
                      return (
                        <motion.span
                          key={`letter-${currentIndex}`}
                          id={`letter-${currentIndex}`}
                          className={`inline-block ${
                            isSpacedText ? "mx-1" : ""
                          }`}
                          style={{
                            textShadow: "0 0 10px rgba(108,99,255,0.5)",
                          }}
                        >
                          {letter}
                        </motion.span>
                      );
                    })}
                  </span>
                  {wordIndex < words.length - 1 && (
                    <motion.span
                      key={`space-${wordIndex}`}
                      id={`letter-${letterIndex++}`}
                      className="inline-block w-4 sm:w-6"
                    />
                  )}
                </React.Fragment>
              ));
            })()}
          </h1>
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
          <div className="relative px-6 md:px-8"> {/* Added padding for Sparkonomy */}
            <h2
              ref={sparkonomyRef}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-normal text-white whitespace-nowrap select-none mx-auto"
              style={{
                textShadow: "0 0 20px rgba(108,99,255,0.3)",
              }}
            >
              Sparkonomy
            </h2>
          </div>

          <p
            className="text-lg sm:text-xl md:text-2xl mb-12 relative text-white opacity-100 select-none"
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
