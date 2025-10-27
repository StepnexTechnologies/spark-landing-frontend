"use client";

import {useEffect, useState} from "react";
import {BadgeCheck, Heart, Send, XIcon} from "lucide-react";
import AnimatedEmojis from "./AnimatedEmojis";
import Image from "next/image";
import FloatingHearts from "./FloatingHearts";

export default function StoryContent4() {
  const [heartTriggerCount, setHeartTriggerCount] = useState(0);

  // Auto-trigger hearts at intervals
  useEffect(() => {
    // Trigger immediately on mount
    setHeartTriggerCount(1);

    // Then continue at intervals
    const interval = setInterval(() => {
      setHeartTriggerCount((prev) => prev + 1);
    }, 1400); // Trigger every 1400ms for smoother, less jittery animation

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#DD2A7B] via-[#9747FF] to-[#9747FF]">
      {/* Header */}
      <div className="absolute top-[41px] left-1/2 -translate-x-1/2 w-full max-w-[390px] px-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <Image src={"/images/creator/earn/story-avatar.png"} alt={"Avatar"} width={36} height={36}/>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <p className="text-white text-xs font-semibold">Ruffles</p>
              <span className="text-[10px]"><BadgeCheck width={14} height={14} /></span>
            </div>
            <p className="text-white/70 text-[11px]">Sponsored</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-white">⋯</button>
          <button className="text-white text-3xl"><XIcon/></button>
        </div>
      </div>

      {/* Main Image */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[362px] h-[595px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900/50 to-pink-900/50">
        <Image src={"/images/creator/earn/upset-young-beautiful-businesswoman-sitting-workplace-3.png"} alt={"Bunny"}  width={362} height={595}/>
      </div>

      {/* Top Text */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-2xl">
        <p className="text-[#111111] text-[27px] font-semibold text-center leading-tight tracking-tight text-nowrap">
          🚫NO MORE! 🙅🏻‍♀️🙅🏽
        </p>
      </div>

      {/* Features List */}
      <div className="absolute top-[63%] left-1/2 -translate-x-1/2 flex flex-col gap-0.5 w-full max-w-[312px] px-3" style={{ fontFamily: "Courier New" }}>
        <div className="bg-white px-2 py-1.5 rounded w-fit">
          <p className="text-[#111111] text-[15px] font-bold leading-tight tracking-tight">
            I found an AI made for us creator folks.
          </p>
        </div>
        <div className="bg-white px-2 py-1 rounded w-fit">
          <p className="text-[#111111] text-[15px] font-bold leading-tight tracking-tight">
            ✅Chat/Screenshot &gt; Invoice
          </p>
        </div>
        <div className="bg-white px-2 py-1 rounded w-fit">
          <p className="text-[#111111] text-[15px] font-bold leading-tight tracking-tight">
            ✅Automatic Reminder
          </p>
        </div>
        <div className="bg-white px-2 py-1 rounded w-fit">
          <p className="text-[#111111] text-[15px] font-bold leading-tight tracking-tight">
            ✅ 🇮🇳Tax Compliant
          </p>
        </div>
        <div className="bg-white px-2 py-1 rounded w-fit">
          <p className="text-[#111111] text-[15px] font-bold leading-tight tracking-tight">
            🤩freeeeeeee 🤩
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-2 flex items-center gap-4 z-40">
        <div className="flex-1 border border-white/50 rounded-full px-5 py-1.5 flex items-center justify-start">
          <AnimatedEmojis
            emojis={["❤️", "❤️", "❤️", "❤️", "❤️", "❤️", "❤️", "❤️", "❤️", "❤️"]}
            className="text-base"
          />
        </div>
        <button className="text-white text-xl">
          <Heart width={24} height={24} fill="#FF0000" stroke={"FF0000"} />
        </button>
        <button className="text-white text-xl"><Send width={24} height={24} /></button>
      </div>

      {/* Floating Hearts Animation */}
      <FloatingHearts triggerCount={heartTriggerCount} />
    </div>
  );
}
