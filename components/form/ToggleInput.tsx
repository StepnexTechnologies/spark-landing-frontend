"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";

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
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Email validation: must have valid format with @ and domain
  const isValidEmail = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value.trim());
  };

  // Phone validation: digits only, optional + at start, 7-15 digits
  const isValidPhone = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    return phoneRegex.test(cleaned);
  };

  const toggleInputType = () => {
    setInputType(prev => prev === 'email' ? 'phone' : 'email');
    setInputValue('');
    setError(null);
    setTouched(false);
  };

  const hasInput = inputValue.trim().length > 0;

  const validateInput = (value: string): string | null => {
    if (!value.trim()) {
      return inputType === 'email' ? 'Email is required' : 'Phone number is required';
    }
    if (inputType === 'email') {
      if (!isValidEmail(value)) {
        return 'Please enter a valid email address';
      }
    } else {
      // Check if contains any non-digit characters (except + at start and spaces)
      const cleaned = value.replace(/\s/g, '');
      if (/[^0-9+]/.test(cleaned) || (cleaned.includes('+') && !cleaned.startsWith('+'))) {
        return 'Phone number should contain digits only';
      }
      if (!isValidPhone(value)) {
        return 'Please enter a valid phone number (7-15 digits)';
      }
    }
    return null;
  };

  const isValidInput = () => {
    return validateInput(inputValue) === null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // For phone input, only allow digits, + at start, and spaces
    if (inputType === 'phone') {
      // Allow only digits, +, and spaces
      value = value.replace(/[^0-9+\s]/g, '');
      // Ensure + is only at the start
      if (value.includes('+') && !value.startsWith('+')) {
        value = value.replace(/\+/g, '');
      }
      // Only allow one + at the start
      if (value.startsWith('+')) {
        value = '+' + value.slice(1).replace(/\+/g, '');
      }
    }

    setInputValue(value);

    // Clear error when user starts typing correctly
    if (touched && value.trim()) {
      const validationError = validateInput(value);
      setError(validationError);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (hasInput) {
      const validationError = validateInput(inputValue);
      setError(validationError);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const validationError = validateInput(inputValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onSubmit(inputValue, inputType);
    setInputValue("");
    setTouched(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setTouched(true);

      const validationError = validateInput(inputValue);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      onSubmit(inputValue, inputType);
      setInputValue("");
      setTouched(false);
    }
  };

  const isLight = variant === 'light';

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <div className={`flex items-center rounded-full px-1 py-1 border-2 transition-colors ${
        error && touched
          ? 'border-red-500'
          : isLight ? 'border-primary bg-transparent' : 'border-[#6C63FF] bg-black/50'
      }`}>
        <input
          type={inputType === 'email' ? 'email' : 'tel'}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={inputType === 'email' ? placeholder.email : placeholder.phone}
          className={`flex-1 px-3 py-2 focus:outline-none bg-transparent rounded-full ${
            isLight
              ? 'text-[#999999] placeholder:text-[#999999]/90'
              : 'text-white placeholder:text-gray-400'
          }`}
        />

        <div className="flex items-center">
          <AnimatePresence mode="wait">
            {!hasInput ? (
              // Toggle switch when input is empty
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
                  {/* Background sliding indicator */}
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

                  {/* Email icon */}
                  <div className="relative z-10 flex items-center justify-center" style={{ width: '32px', height: '28px' }}>
                    <Mail
                      className={`w-4 h-4 transition-colors duration-300 ${
                        inputType === 'email' ? 'text-white' : isLight ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    />
                  </div>

                  {/* Phone icon */}
                  <div className="relative z-10 flex items-center justify-center" style={{ width: '32px', height: '28px' }}>
                    <Phone
                      className={`w-4 h-4 transition-colors duration-300 ${
                        inputType === 'phone' ? 'text-white' : isLight ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    />
                  </div>
                </motion.button>
              </motion.div>
            ) : (
              // Submit button when input has content
              <motion.button
                key="submit"
                type="submit"
                disabled={loading || !isValidInput()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  background: isLight
                    ? 'linear-gradient(309.99deg, #DD2A7B 3.31%, #9747FF 39.79%, #334CCA 91.72%)'
                    : '#6C63FF'
                }}
                className={`flex items-center justify-center rounded-full text-white transition-opacity duration-300 ${
                  isValidInput() ? 'cursor-pointer hover:opacity-90' : 'opacity-50 cursor-not-allowed'
                } ${buttonText ? 'gap-2 px-2.5 py-2.5 text-sm font-medium' : 'w-10 h-10'}`}
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
                    {buttonText && <span>{buttonText}</span>}
                    {buttonText ? (
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
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </>
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && touched && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className={`text-sm absolute left-5 top-[34px] mt-1 bg-[#F2F2F2] p-[1px] rounded ${isLight ? 'text-red-500' : 'text-red-400'}`}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
