"use client";

import {useEffect, useRef} from "react";
import gsap from "gsap";

interface MainBannerProps {
  // When false, content is rendered but invisible (so parents can pre-mount it
  // and time the reveal via these flags).
  titleVisible?: boolean;
  subtextVisible?: boolean;
  className?: string;
}

export default function MainBanner({
  titleVisible = true,
  subtextVisible = true,
  className,
}: MainBannerProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!titleVisible || !titleRef.current) return;

    const contentTl = gsap.timeline();
    const chars = titleRef.current.textContent?.split("") || [];
    titleRef.current.innerHTML = "";
    chars.forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      titleRef.current?.appendChild(span);
    });

    contentTl.to(titleRef.current.children, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      stagger: 0.03,
      ease: "power1.out",
    });

    contentTl.to(
      titleRef.current.children,
      {
        color: "#6C63FF",
        textShadow: "0 0 10px rgba(108,99,255,0.7)",
        duration: 0.5,
        stagger: {each: 0.1, repeat: -1, yoyo: true},
        onUpdate: function (this: gsap.TweenVars) {
          const progress = this.progress();
          const scaleValue = 1 + Math.sin(progress * Math.PI) * 0.1;
          gsap.set(this.targets(), {scale: scaleValue});
        },
      },
      "+=0.1",
    );

    gsap.to(titleRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, [titleVisible]);

  useEffect(() => {
    if (!subtextVisible || !taglineRef.current) return;
    gsap.fromTo(
      taglineRef.current,
      {opacity: 0, y: 20},
      {opacity: 1, y: 0, duration: 0.8, ease: "power2.out"},
    );
  }, [subtextVisible]);

  return (
    <div className={`text-center ${className ?? ""}`}>
      <div
        className="relative px-4 w-full flex justify-center transition-opacity duration-700"
        style={{opacity: titleVisible ? 1 : 0}}
      >
        <h2
          ref={titleRef}
          className="text-5xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 tracking-normal text-white select-none whitespace-nowrap"
          style={{textShadow: "0 0 20px rgba(108,99,255,0.3)"}}
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
        Developing AI to spark Creator livelihoods
      </p>
    </div>
  );
}
