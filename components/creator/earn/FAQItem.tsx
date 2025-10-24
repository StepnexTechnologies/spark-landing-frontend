"use client";

import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {ChevronDown} from "lucide-react";

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
    if (isControlled && onToggle) {
      onToggle();
    } else {
      setIsOpenInternal(!isOpenInternal);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border-b border-white/20 md:border-white pb-3 md:pb-3"
    >
      <button
        onClick={handleToggle}
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
            <p className="text-sm md:text-[14px] text-white leading-[1.4] pb-5">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
