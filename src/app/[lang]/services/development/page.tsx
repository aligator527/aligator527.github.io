import Banner from "@/components/banner";
import ContactForm from "@/components/contact";
import CookieConsentForm from "@/components/cookie";
import Footer from "@/components/footer";
import Header from "@/components/header";
import ItServiceContainer from "@/components/itcontainer";
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
    title: SeoData.development.title[lang],
    description: SeoData.development.description[lang],
    keywords: SeoData.development.keywords[lang],
    alternates: {
      canonical: '/en/services/development',
      languages: {
        'en': '/en/services/development',
        'ja': '/ja/services/development',
        'zh': '/zh/services/development',
        'ru': '/ru/services/development',
      },
    },
    openGraph: {
      title: SeoData.development.title[lang],
      description: SeoData.development.description[lang],
      url: `https://aligator527.github.io/${lang}/services/development`,
      siteName: 'Wanya Group | ワニャグループ',
      images: `images/opengraph/homepage/${lang}/thumbnail.png`
    }
  }
}

export default function ITDevelopmentService() {

  return (
    <>
      <Header />
      <Banner />
      <ItServiceContainer />
      <ContactForm />
      <CookieConsentForm />
      <Footer />
    </>
  );
}