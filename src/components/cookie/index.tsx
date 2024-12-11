"use client"
import { useLanguage } from "@/context/languageContext";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

export default function CookieConsentForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [cookies, setCookie] = useCookies(["cookieConsent"]);
  const { language } = useLanguage();

  useEffect(() => {
    if (!cookies.cookieConsent) {
      setTimeout(() => setIsOpen(true), 500);
    }
  }, [cookies.cookieConsent]);

  const handleAccept = () => {
    setCookie("cookieConsent", "accepted", { path: "/", maxAge: 365 * 24 * 60 * 60 });
    setIsOpen(false);
  };

  const handleDecline = () => {
    setCookie("cookieConsent", "declined", { path: "/", maxAge: 365 * 24 * 60 * 60 });
    setIsOpen(false);
  };

  const generateHref = (language: string, path: string) => {
    // Ensure the path is correctly formatted with a leading '/'
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `/${language}${cleanPath}`;
  };

  if (!isOpen) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 z-50">
      <div
        className="max-w-screen-lg mx-auto fixed bg-white inset-x-5 p-5 bottom-20 rounded-lg drop-shadow-2xl flex gap-4 flex-wrap md:flex-nowrap text-center md:text-left items-center justify-center md:justify-between"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1)" : "scale(0.9)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        <div className="w-full">
          This website uses cookies to enhance your browsing experience and to ensure compliance with GDPR. For more details, please read our{" "}
          <Link href={generateHref(language, "/privacy")} className="font-semibold text-[#59705b]">
                            Privacy Policy.
          </Link>
          .
        </div>
        <div className="flex gap-4 items-center flex-shrink-0">
          <button
            onClick={handleDecline}
            className="text-[#59705b] focus:outline-none hover:underline"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="bg-[#59705b]/80 px-5 py-2 text-white rounded-md hover:bg-[#59705b] focus:outline-none"
          >
            Allow Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
