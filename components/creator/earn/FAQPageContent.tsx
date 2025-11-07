"use client";

import {motion} from "framer-motion";
import {useState} from "react";
import FAQItem from "./FAQItem";
import {ChevronDown} from "lucide-react";
import {allFAQs, faqCategories} from "@/data/faqs";

export default function FAQPageContent() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const filteredFAQs =
    selectedCategory === "All"
      ? allFAQs
      : allFAQs.filter((faq) => faq.category === selectedCategory);

  return (
    <section className="relative py-12 md:py-20 px-5 md:px-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[40px] md:text-[40px] font-bold text-white mb-8 md:mb-12 text-left md:text-left"
        >
          Frequently Asked Questions
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Mobile Category Dropdown */}
          <div className="lg:hidden relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full bg-white/4 rounded-[12px] p-4 flex items-center justify-between text-white bg-gradient-to-br from-white/10 via-white/0 to-black/10 border border-white/20 backdrop-blur-[2px]"
            >
              <span className="font-medium">{selectedCategory}</span>
              <ChevronDown
                className={`w-6 h-6 transition-transform ${
                  showCategoryDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
            {showCategoryDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 top-full mt-2 left-0 right-0 bg-white/10 rounded-[16px] border border-white/20 backdrop-blur-md overflow-hidden p-2"
              >
                {faqCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full p-3 text-left transition-colors rounded-[12px] font-medium ${
                      selectedCategory === category
                        ? "bg-white/30 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Desktop Category Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col gap-1 w-[180px] flex-shrink-0"
          >
            {faqCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-4 rounded-[30px] text-left transition-all w-full bg-white/4 hover:bg-white/10 p-4 flex items-center justify-center text-white bg-gradient-to-br from-white/10 to-black/10 border border-white/15 backdrop-blur-[2px] shadow-[10px_10px_30px_rgba(0,0,0,0.2),0px_-10px_30px_rgba(255,255,255,0.1)] ${
                  selectedCategory === category
                    ? "bg-white/10"
                    : ""
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* FAQ List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 space-y-6"
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
