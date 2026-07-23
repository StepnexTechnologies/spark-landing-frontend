"use client";

import { m } from "framer-motion";
import {useState} from "react";
import FAQItem from "./FAQItem";
import PlanComparison from "./PlanComparison";
import {ChevronDown} from "lucide-react";
import {useIsIndianUser} from "@/hooks/useGeolocation";
import {useTranslation} from "react-i18next";

interface FAQTranslation {
  question: string;
  answer: string;
  category?: string;
}

interface FAQCategoryTranslation {
  key: string;
  label: string;
}

export default function FAQPageContent() {
  const {t} = useTranslation("creatorEarn");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const {isIndian, isLoading: isGeoLoading} = useIsIndianUser();

  // Get FAQs and categories from translations
  const faqItems = t("faq.items", {returnObjects: true}) as FAQTranslation[];
  const allFAQs = Array.isArray(faqItems) ? faqItems : [];
  const faqCategoriesData = t("faq.categories", {returnObjects: true}) as FAQCategoryTranslation[];
  const faqCategories = Array.isArray(faqCategoriesData) ? faqCategoriesData : [];

  const filteredFAQs =
    selectedCategory === "all"
      ? allFAQs
      : allFAQs.filter((faq) => faq.category === selectedCategory);

  return (
    <section className="relative py-12 md:py-20 px-5 md:px-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Page Title */}
        <m.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[40px] md:text-[40px] font-bold text-white mb-8 md:mb-12 text-left md:text-left"
        >
          {t("faq.title")}
        </m.h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-w-0">
          {/* Mobile Category Dropdown */}
          <div className="lg:hidden relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full bg-white/4 rounded-[12px] p-4 flex items-center justify-between text-white bg-gradient-to-br from-white/10 via-white/0 to-black/10 border border-white/20 backdrop-blur-[2px]"
            >
              <span className="font-medium">
                {faqCategories.find((c) => c.key === selectedCategory)?.label || selectedCategory}
              </span>
              <ChevronDown
                className={`w-6 h-6 transition-transform ${
                  showCategoryDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
            {showCategoryDropdown && (
              <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 top-full mt-2 left-0 right-0 bg-white/10 rounded-[16px] border border-white/20 backdrop-blur-md overflow-hidden p-2"
              >
                {faqCategories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => {
                      setSelectedCategory(category.key);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full p-3 text-left transition-colors rounded-[12px] font-medium ${
                      selectedCategory === category.key
                        ? "bg-white/30 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </m.div>
            )}
          </div>

          {/* Desktop Category Sidebar */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col gap-1 w-[180px] flex-shrink-0"
          >
            {faqCategories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-4 rounded-[30px] text-left transition-all w-full bg-white/4 hover:bg-white/10 p-4 flex items-center justify-center text-white bg-gradient-to-br from-white/10 to-black/10 border border-white/15 backdrop-blur-[2px] shadow-[10px_10px_30px_rgba(0,0,0,0.2),0px_-10px_30px_rgba(255,255,255,0.1)] ${
                  selectedCategory === category.key
                    ? "bg-white/10"
                    : ""
                }`}
              >
                {category.label}
              </button>
            ))}
          </m.div>

          {/* FAQ List */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 space-y-6 min-w-0"
          >
            {filteredFAQs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isExpanded={expandedFAQ === index}
                onToggle={() =>
                  setExpandedFAQ(expandedFAQ === index ? null : index)
                }
                index={index}
              />
            ))}

            {/* Plan Comparison - shown under Pricing category for Indian users */}
            {selectedCategory === "pricing" && isIndian && !isGeoLoading && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 w-full overflow-x-auto"
              >
                <PlanComparison showTitle={true} showActionButtons={false} showPricing={true} />
              </m.div>
            )}
          </m.div>
        </div>
      </div>
    </section>
  );
}
