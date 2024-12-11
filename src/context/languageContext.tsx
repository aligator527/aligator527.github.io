// context/languageContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

type Language = "en" | "ja" | "zh" | "ru";

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");
  const router = useRouter();

  useEffect(() => {
    // Extract the current language from the URL
    const lang = window.location.pathname.split("/")[1] as Language;
    setLanguage(lang || "en");
  }, []);

  const changeLanguage = (lang: Language) => {
    const currentLang = window.location.pathname.split("/")[1] as Language || "en";
    const updatedPath = `/${lang}${window.location.pathname.substring(currentLang.length + 1)}`;
    router.push(updatedPath);
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
