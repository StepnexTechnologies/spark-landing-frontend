"use client";

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'hi-Latn', label: 'HI' },
  ];

  const currentLang = i18n.language?.startsWith('hi') ? 'hi-Latn' : 'en';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className={`flex items-center ${className}`}
    >
      <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
              currentLang === lang.code
                ? 'bg-[#6C63FF] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default LanguageSwitcher;
