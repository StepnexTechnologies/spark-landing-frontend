"use client";

import {Info, Lock} from "lucide-react";
import {motion} from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 4, duration: 0.5, ease: "easeInOut" }}
      className="fixed bottom-0 w-full left-0 right-0 select-none z-50"
    >
      <div className="flex flex-col items-center space-y-2 w-full px-4 pb-4">
        <motion.div
          className="flex items-center justify-center space-x-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 w-fit cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-2 text-[8px] sm:text-sm text-gray-300">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
            </motion.div>
            <Link href="/legal/privacy-policy" className="text-sm">Your data is secure with us</Link>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between text-[12px] md:text-[14px] text-gray-500 w-full space-y-2 md:space-y-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-center md:justify-start space-x-2 md:space-x-4">
            <Link href="/" className="hover:underline hover:text-purple-400">Home</Link>
            <Link href="/about" className="hover:underline hover:text-purple-400">About Us</Link>
            {/*<span className="text-gray-600">|</span>*/}
            <Link href="/contact" className="hover:underline hover:text-purple-400">Contact Us</Link>
          </div>
          
          <div className="flex items-center justify-center space-x-1">
            <Info className="w-3 h-3" />
            <span className="text-center">© 2025 Sparkonomy Pte. Ltd. All rights reserved</span>
          </div>
          
          <div className="flex items-center justify-center md:justify-end space-x-2 md:space-x-4">
            <Link href="/legal/privacy-policy" className="hover:underline hover:text-purple-400">Privacy Policy</Link>
            {/*<span className="text-gray-600">|</span>*/}
            <Link href="/legal/terms" className="hover:underline hover:text-purple-400">Terms of Service</Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
