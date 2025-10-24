"use client";

import Navigation from "@/components/creator/earn/Navigation";
import CTASection from "@/components/creator/earn/CTASection";
import EarnFooter from "@/components/creator/earn/EarnFooter";
import FAQPageContent from "@/components/creator/earn/FAQPageContent";

export default function CreatorEarnFAQsPage() {
    return (
        <main className="relative min-h-screen bg-black overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute -top-[400px] -left-[940px] inset-0 pointer-events-none">
                {/* Pink to Purple Gradient Blob */}
                <div className="mt-[500px] w-[2422px] h-[40%] md:w-[4500px] md:h-[2422px] gradient-blob" />
                <div className="-mt-[1000px] w-[2422px] h-[66%] md:w-[4500px] gradient-blob" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <Navigation />
                <FAQPageContent />
                <CTASection/>
                <EarnFooter/>
            </div>
        </main>
    );
}
