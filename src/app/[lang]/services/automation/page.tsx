import Banner from "@/components/banner";
import ContactForm from "@/components/contact";
import CookieConsentForm from "@/components/cookie";
import DxServiceContainer from "@/components/dxcontainer";
import Footer from "@/components/footer";
import Header from "@/components/header";
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
    title: SeoData.dx.title[lang],
    description: SeoData.dx.description[lang],
    keywords: SeoData.dx.keywords[lang],
    alternates: {
      canonical: '/en/services/automation',
      languages: {
        'en': '/en/services/automation',
        'ja': '/ja/services/automation',
        'zh': '/zh/services/automation',
        'ru': '/ru/services/automation',
      },
    },
    openGraph: {
      title: SeoData.dx.title[lang],
      description: SeoData.dx.description[lang],
      url: `https://aligator527.github.io/${lang}/services/automation`,
      siteName: 'Wanya Group | ワニャグループ',
      images: `images/opengraph/homepage/${lang}/thumbnail.png`
    }
  }
}

export default function DXService() {

  return (
    <>
      <Header />
      <Banner />
      <DxServiceContainer />
      <ContactForm />
      <CookieConsentForm />
      <Footer />
    </>
  );
}