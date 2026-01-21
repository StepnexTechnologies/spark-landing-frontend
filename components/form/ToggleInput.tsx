"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";

interface ToggleInputProps {
  onSubmit: (value: string, type: 'email' | 'phone') => void;
  loading?: boolean;
  placeholder?: {
    email: string;
    phone: string;
  };
  buttonText?: string;
  variant?: 'light' | 'dark';
}

export default function ToggleInput({
  onSubmit,
  loading = false,
  placeholder = {
    email: "Enter email",
    phone: "Enter phone number",
  },
  buttonText = "Submit",
  variant = 'light',
}: ToggleInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [inputType, setInputType] = useState<'email' | 'phone'>('email');

  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPhone = (value: string) => /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''));

  const toggleInputType = () => {
    setInputType(prev => prev === 'email' ? 'phone' : 'email');
    setInputValue('');
  };

  const hasInput = inputValue.trim().length > 0;

  const isValidInput = () => {
    if (!inputValue.trim()) return false;
    if (inputType === 'email') {
      return isEmail(inputValue);
    } else {
      return isValidPhone(inputValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidInput()) {
      onSubmit(inputValue, inputType);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isValidInput()) {
        onSubmit(inputValue, inputType);
        setInputValue("");
      }
    }
  };

  const isLight = variant === 'light';

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex items-center rounded-full px-1 py-1 border-2 ${
        isLight ? 'border-primary bg-transparent' : 'border-[#6C63FF] bg-black/50'
      }`}>
        <input
          type={inputType === 'email' ? 'email' : 'tel'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={inputType === 'email' ? placeholder.email : placeholder.phone}
          className={`flex-1 px-3 py-2 focus:outline-none bg-transparent rounded-full text-sm ${
            isLight
              ? 'text-[#999999] placeholder:text-[#999999]/90'
              : 'text-white placeholder:text-gray-400'
          }`}
        />

        <div className="flex items-center gap-1">
          <AnimatePresence mode="wait">
            {!hasInput ? (
              <motion.div
                key="toggle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  type="button"
                  onClick={toggleInputType}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center rounded-full p-1 border transition-all duration-300 ${
                    isLight
                      ? 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                      : 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15'
                  }`}
                  style={{ width: '72px', height: '36px' }}
                >
                  <motion.div
                    className="absolute rounded-full shadow-lg"
                    style={{
                      width: '32px',
                      height: '28px',
                      background: isLight
                        ? 'linear-gradient(309.99deg, #DD2A7B 3.31%, #9747FF 39.79%, #334CCA 91.72%)'
                        : '#6C63FF'
                    }}
                    animate={{
                      x: inputType === 'email' ? -0.5 : 30,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />

                  <div className="relative z-10 flex items-center justify-center" style={{ width: '32px', height: '28px' }}>
                    <Mail
                      className={`w-4 h-4 transition-colors duration-300 ${
                        inputType === 'email' ? 'text-white' : isLight ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    />
                  </div>

                  <div className="relative z-10 flex items-center justify-center" style={{ width: '32px', height: '28px' }}>
                    <Phone
                      className={`w-4 h-4 transition-colors duration-300 ${
                        inputType === 'phone' ? 'text-white' : isLight ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    />
                  </div>
                </motion.button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading || !isValidInput()}
            style={{
              background: isLight
                ? 'linear-gradient(309.99deg, #DD2A7B 3.31%, #9747FF 39.79%, #334CCA 91.72%)'
                : '#6C63FF'
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-white font-medium transition-opacity whitespace-nowrap text-sm ${
              isValidInput() ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                {buttonText}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 17L17 7M17 7H7M17 7V17"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
