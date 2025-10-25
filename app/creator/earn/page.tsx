"use client";

import Navigation from "@/components/creator/earn/Navigation";
import HeroSection from "@/components/creator/earn/HeroSection";
import ValueProposition from "@/components/creator/earn/ValueProposition";
import BenefitsSection from "@/components/creator/earn/BenefitsSection";
import AdvantageSection from "@/components/creator/earn/AdvantageSection";
import TestimonialsSection from "@/components/creator/earn/TestimonialsSection";
import VideoSection from "@/components/creator/earn/VideoSection";
import FAQSection from "@/components/creator/earn/FAQSection";
import CTASection from "@/components/creator/earn/CTASection";
import EarnFooter from "@/components/creator/earn/EarnFooter";

export default function CreatorEarnPage() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute -top-[400px] -left-[940px] inset-0 pointer-events-none">
        {/* Pink to Purple Gradient Blob */}
        <div className="mt-[500px] w-[2422px] h-[2422px] md:w-[4500px] gradient-blob" />
        <div className="-mt-[1000px] w-[2422px] h-[65%] md:w-[4500px] md:h-[62%] gradient-blob" />
        {/*<div className="-mt-[1000px] w-[2422px] h-[2422px] md:w-[2422px] md:h-[2422px] gradient-blob" />*/}
        {/*<div className="-mt-[890px] w-[2422px] h-[2422px] md:w-[2422px] md:h-[2422px] gradient-blob" />*/}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <ValueProposition />
        <BenefitsSection />
        <AdvantageSection />
        <TestimonialsSection />
        <VideoSection />
        <FAQSection />
        <CTASection />
        <EarnFooter />
      </div>
    </main>
  );
}
