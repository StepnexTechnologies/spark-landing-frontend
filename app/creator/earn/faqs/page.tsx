import type {Metadata} from "next";
import Navigation from "@/components/creator/earn/Navigation";
import CTASection from "@/components/creator/earn/CTASection";
import EarnFooter from "@/components/creator/earn/EarnFooter";
import FAQPageContent from "@/components/creator/earn/FAQPageContent";
import {siteUrl} from "@/lib/urls";

const title = "Creator FAQs: Invoicing, Payments & Taxes | Sparkonomy";
const description =
    "Find answers about Sparkonomy Creator invoicing, payment reminders, taxes, GST, pricing, and getting paid faster.";
const canonicalUrl = siteUrl("/creator/earn/faqs");

export const metadata: Metadata = {
    title,
    description,
    alternates: {
        canonical: canonicalUrl,
    },
    openGraph: {
        title,
        description,
        url: canonicalUrl,
    },
};

export default function CreatorEarnFAQsPage() {
    return (
        <main className="relative min-h-screen bg-black overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute -top-[400px] -left-[940px] inset-0 pointer-events-none">
                {/* Pink to Purple Gradient Blob */}
                <div className="mt-[500px] w-[2422px] h-[34%] md:w-[4500px] gradient-blob" />
                <div className="-mt-[1000px] w-[2422px] h-[71%] md:w-[4500px] gradient-blob" />
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
