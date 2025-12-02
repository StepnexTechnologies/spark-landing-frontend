"use client";

import Image from "next/image";
import {BadgeCheck, Heart, Send} from "lucide-react";
import AnimatedEmojis from "./AnimatedEmojis";

export default function StoryContent1() {
  return (
    <div className="relative w-full h-full">
      {/* Header */}
      <div className="absolute top-[41px] left-1/2 -translate-x-1/2 w-full max-w-[390px] px-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          {/*<div className="w-9 h-9 rounded-full bg-white overflow-hidden flex items-center justify-center">*/}
          {/*  <span className="text-lg">🐶</span>*/}
          {/*</div>*/}
          <Image src={"/images/creator/earn/story-avatar.png"} alt={"Avatar"} width={36} height={36}/>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <p className="text-white text-xs font-semibold pr-0.5">creator.cries</p>
              <span className="text-[10px]"><BadgeCheck width={14} height={14} /></span>
            </div>
            <p className="text-white/70 text-[11px]">Sponsored</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mr-10">
          <button className="text-white">⋯</button>
        </div>
      </div>

      {/* Main Image */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[90vw] sm:w-[362px] max-w-[362px] max-h-[calc(100%-150px)] aspect-[362/595] rounded-3xl overflow-hidden ">
        <Image
          src={"/images/creator/earn/story-1.png"}
          alt={"Bunny"}
          width={362}
          height={595}
          priority
          className="h-full w-full object-contain"
        />
      </div>

      {/*/!* Top Text *!/*/}
      {/*<div className={`absolute top-[26%] left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-2xl transition-opacity duration-200 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}>*/}
      {/*  <p className="text-[#111111] text-[27px] font-semibold text-center leading-tight tracking-tight text-nowrap">*/}
      {/*    RAISE YOUR HAND*/}
      {/*  </p>*/}
      {/*</div>*/}

      {/*/!* Bottom Text *!/*/}
      {/*<div className={`absolute top-[75%] left-1/2 -translate-x-1/2  px-3 py-1.5 rounded-xl transition-opacity duration-200 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ fontFamily: "Courier New" }}>*/}
      {/*  <div className="text-black text-lg font-[700] text-center w-[190px]">*/}
      {/*      <div className={"bg-[#FBFF00] p-2 transform skew-x-[-15deg] -mb-7"}>if YOU want your</div>*/}
      {/*    <br />*/}
      {/*      <div className={"bg-[#FBFF00] p-2 transform skew-x-[-15deg]"}>payments faster!</div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/* Bottom Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-2 flex items-center gap-4">
          <div className="flex-1 border border-white/50 rounded-full px-5 py-1 flex items-center justify-start">
            <AnimatedEmojis
              emojis={["🙋🏼‍♂️", "🙋🏼‍♀️", "🙋🏻‍♂️", "🙋🏻‍♀️", "🙋🏾‍♀️", "🙋🏽", "🙋🏽‍♀️", "🙋‍♂️"]}
              className="text-xl"
            />
          </div>

        <button className="text-white text-xl"><Heart width={24} height={24} /></button>
        <button className="text-white text-xl"><Send width={24} height={24} /></button>
      </div>
    </div>
  );
}
