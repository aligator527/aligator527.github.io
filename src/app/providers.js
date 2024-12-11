'use client';

import { LanguageProvider } from "@/context/languageContext";

export function Providers({ children }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}