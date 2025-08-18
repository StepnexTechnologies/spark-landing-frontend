"use client";
import type React from "react";
import {useEffect, useRef, useState} from "react";

import {motion} from "framer-motion";
import gsap from "gsap";
import EmailCapture from "@/components/EmailCapture";

const HeroSection = () => {
  const [isTextRevealed, setIsTextRevealed] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInitialAnimationComplete, setIsInitialAnimationComplete] = useState(false);
  const [isDesktopDevice, setIsDesktopDevice] = useState(true); // Default to desktop

  // States for sequential lazy loading
  const [titleVisible, setTitleVisible] = useState(false);
  const [subtextVisible, setSubtextVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  console.log(ctaVisible)
  const [emailCaptureVisible, setEmailCaptureVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);
  const sparkonomyRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Device detection - run once on component mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    let isDesktop = true;

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
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // "Igniting Now..." animation is complete
        setIsInitialAnimationComplete(true);
      },
    });

    // Animate "IGNITING" letter by letter with chained timing
    [..."Igniting"].forEach((letter,index) => {
      tl.fromTo(
        `#letter-igniting-${index}`,
        { opacity: 0},
        {
          opacity: 1,
          duration: 0.11,
          ease: "",
        },
      );
    });

    // Add a small pause between word animations
    tl.to({}, { duration: 0.2 });

    // Animate "NOW..." letter by letter with chained timing
    [..."Now..."].forEach(( letter,index) => {
      tl.fromTo(
        `#letter-now-${index}`,
        { opacity: 0},
        {
          opacity: 1,
          duration: 0.11,
          ease: "easeInOut",
        },
      );
    });

    return () => {
      tl.kill();
    };
  }, []);

  // Decide what to show after initial animation completes
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

        // After another 200ms, show the CTA
        const ctaTimer = setTimeout(() => {
          setCtaVisible(true);

          // After another 200ms, show the email capture
          const emailTimer = setTimeout(() => {
            setEmailCaptureVisible(true);
          }, 200);

          return () => clearTimeout(emailTimer);
        }, 200);

        return () => clearTimeout(ctaTimer);
      }, 200);

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
      className={`flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden bg-none pointer-events-none`}
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
          className={`absolute inset-0 flex flex-col space-y-8 items-center justify-center mb-12 ${showContent && 'hidden'}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: showContent ? 0 : 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white flex items-center justify-center gap-4 select-none">
            <span className="flex justify-center items-center w-min">
              {[..."Igniting"].map((letter, index) => (
                <motion.span
                  key={`igniting-${index}`}
                  id={`letter-igniting-${index}`}
                  className="flex w-min justify-center items-center"
                  style={{
                    textShadow: "0 0 10px rgba(108,99,255,0.5)",
                  }}
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
                  style={{
                    textShadow: "0 0 10px rgba(108,99,255,0.5)",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </h1>
          <motion.h3
            id="promptLine"
            initial={{ opacity: 0 }}
            animate={{
              opacity: (isInitialAnimationComplete && !showContent) ? 1 : 0 ,
            }}
            transition={{ delay: 2, duration: 1, ease: "easeInOut" }}
          >
            <p className={`tagline text-md sm:text-lg md:text-xl mb-12 relative text-zinc-300 select-none ${showContent && 'hidden'}`}>
              It begins with you—
              <span id="moveText">
                {isDesktopDevice ? "move to ignite" : "touch to ignite"}.
              </span>
            </p>
          </motion.h3>
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
              className="text-5xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 tracking-normal text-white select-none whitespace-nowrap"
              style={{
                textShadow: "0 0 20px rgba(108,99,255,0.3)",
              }}
            >
              Sparkonomy
            </h2>
          </div>

          <p
            ref={taglineRef}
            className="tagline text-lg sm:text-xl md:text-2xl mb-8 relative text-white select-none px-4 transition-opacity duration-700"
            style={{
              opacity: subtextVisible ? 1 : 0,
              transform: subtextVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Developing AI to spark creator livelihoods globally
          </p>

          {/*{showContent && <CampaignTrackerCTA isVisible={ctaVisible} />}*/}

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

          <div
            className="relative pointer-events-auto transition-all duration-700 mt-4"
            style={{
              opacity: emailCaptureVisible ? 1 : 0,
              transform: emailCaptureVisible
                ? "translateY(0)"
                : "translateY(20px)",
            }}
          >
            {showContent && (
              <a
                href="https://beta.brand.sparkonomy.com/rtct"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[16px] text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer select-none italic"
              >
                Private Beta! Real Time Campaign Tracker
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
