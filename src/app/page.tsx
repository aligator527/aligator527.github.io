"use client"
import Banner from '@/components/banner';
import ContactForm from '@/components/contact';
import CookieConsentForm from '@/components/cookie';
import Footer from '@/components/footer';
import Header from '@/components/header';
import HeroBanner from '@/components/hero-banner';
import PartnersCarousel from '@/components/partners';
import RepresentativeMessage from '@/components/representative-message';
import ServicesPanel from '@/components/services';
import TestimonialsCarousel from '@/components/testimonials';
import { useLanguage } from '@/context/languageContext';
import { useEffect } from 'react';

type Language = "en" | "ru" | "ja" | "zh"; // Explicitly define the Language type

export default function Home() {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    const userLang = navigator.language.split('-')[0] as string; // Get primary language code
    const supportedLanguages: Language[] = ["en", "ru", "ja", "zh"]; // Use Language type

    // Narrow userLang to Language type if it's supported
    if (supportedLanguages.includes(userLang as Language)) {
      setLanguage(userLang as Language); // Set the user's language if it's supported
    } else {
      setLanguage("en"); // Default to English if the user's language is unsupported
    }
  }, [setLanguage]); // Include setLanguage in the dependency array

  return (
    <>
      <Header />
      <Banner />
      <HeroBanner />
      <PartnersCarousel />
      <ServicesPanel />
      <TestimonialsCarousel />
      <RepresentativeMessage />
      <ContactForm />
      <CookieConsentForm />
      <Footer />
    </>
  );
}
