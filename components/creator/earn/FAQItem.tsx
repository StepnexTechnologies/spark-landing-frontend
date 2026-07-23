"use client";

import {useState} from "react";
import { m } from "framer-motion";
import {ChevronDown} from "lucide-react";
import {track} from "@/lib/analytics/track";

interface FAQItemProps {
  question: string;
  answer?: string;
  defaultOpen?: boolean;
  // Controlled mode props
  isExpanded?: boolean;
  onToggle?: () => void;
  index?: number;
}

export default function FAQItem({
  question,
  answer,
  defaultOpen = false,
  isExpanded,
  onToggle,
  index = 0,
}: FAQItemProps) {
  // Uncontrolled mode: manage own state
  const [isOpenInternal, setIsOpenInternal] = useState(defaultOpen);

  // Use controlled mode if isExpanded and onToggle are provided
  const isControlled = isExpanded !== undefined && onToggle !== undefined;
  const isOpen = isControlled ? isExpanded : isOpenInternal;

  const handleToggle = () => {
    const willOpen = !isOpen;
    track("earn_faq_toggle", {
      question,
      action: willOpen ? "open" : "close",
      index,
    });
    if (isControlled && onToggle) {
      onToggle();
    } else {
      setIsOpenInternal(!isOpenInternal);
    }
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border-b border-white/20 md:border-white pb-3 md:pb-3"
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        className="w-full flex items-start md:items-center justify-between gap-6 py-5 text-left group"
      >
        <span className="text-lg md:text-xl font-semibold text-white leading-normal flex-1">
          {question}
        </span>
        <m.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 mt-1 md:mt-0"
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </m.div>
      </button>

      {answer && (
          <m.div
            initial={false}
            animate={{
              height: isOpen ? "auto" : 0,
              opacity: isOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-sm md:text-[14px] text-white leading-[1.4] pb-5 whitespace-pre-line">
              {answer}
            </p>
          </m.div>
      )}
    </m.div>
  );
}
