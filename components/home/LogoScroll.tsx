"use client";

import {motion} from "framer-motion";
import LogoCarousel from "@/components/LogoCarousel";

interface LogoScrollProps {
  className?: string;
  showCompliance?: boolean;
}

export default function LogoScroll({className, showCompliance = true}: LogoScrollProps) {
  return (
    <motion.div
      className={`pointer-events-auto ${className ?? ""}`}
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.7, ease: "easeOut"}}
    >
      <LogoCarousel showCompliance={showCompliance}/>
    </motion.div>
  );
}
