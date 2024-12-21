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
import SeoData from "@/data/seo.json";

// Predefine the supported languages
const supportedLanguages = ['en', 'ja', 'zh', 'ru'] as const;
type SupportedLanguage = typeof supportedLanguages[number];

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>; // Awaitable params
}) {
  // read route params
  const { lang } = await params
 
  return {
    title: SeoData.homepage.title[lang],
    description: SeoData.homepage.description[lang],
    keywords: SeoData.homepage.keywords[lang],
    openGraph: {
      images: `images/opengraph/homepage/${lang}/thumbnail.png`
    }
  }
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
