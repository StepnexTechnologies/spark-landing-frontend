"use client";

import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {ChevronDown} from "lucide-react";

interface FAQItemProps {
  question: string;
  answer?: string;
  defaultOpen?: boolean;
}

export default function FAQItem({
  question,
  answer,
  defaultOpen = false,
}: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/20 md:border-white pb-3 md:pb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start md:items-center justify-between gap-6 py-5 text-left group"
      >
        <span className="text-lg md:text-xl font-semibold text-white leading-normal flex-1">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 mt-1 md:mt-0"
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && answer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-white leading-[1.4] pb-5">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
