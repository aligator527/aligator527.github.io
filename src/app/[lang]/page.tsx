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

// Predefine the supported languages
const supportedLanguages = ['en', 'ja', 'zh', 'ru'];

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default function Home() {

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
