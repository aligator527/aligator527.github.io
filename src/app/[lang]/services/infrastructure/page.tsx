import Banner from "@/components/banner";
import ContactForm from "@/components/contact";
import CookieConsentForm from "@/components/cookie";
import Footer from "@/components/footer";
import Header from "@/components/header";
import InfrastructureServiceContainer from "@/components/infrastructurecontainer";
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
    title: SeoData.infrastructure.title[lang],
    description: SeoData.infrastructure.description[lang],
    keywords: SeoData.infrastructure.keywords[lang],
    alternates: {
      canonical: '/en/services/infrastructure',
      languages: {
        'en': '/en/services/infrastructure',
        'ja': '/ja/services/infrastructure',
        'zh': '/zh/services/infrastructure',
        'ru': '/ru/services/infrastructure',
      },
    },
    openGraph: {
      title: SeoData.infrastructure.title[lang],
      description: SeoData.infrastructure.description[lang],
      url: `https://aligator527.github.io/${lang}/services/infrastructure`,
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
      <InfrastructureServiceContainer />
      <ContactForm />
      <CookieConsentForm />
      <Footer />
    </>
  );
}