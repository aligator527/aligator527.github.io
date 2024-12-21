import Banner from "@/components/banner";
import CookieConsentForm from "@/components/cookie";
import Footer from "@/components/footer";
import Header from "@/components/header";
import PrivacyPolicyContainer from "@/components/privacypolicy";
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
    title: SeoData.privacy.title[lang],
    description: SeoData.privacy.description[lang],
    keywords: SeoData.privacy.keywords[lang],
    alternates: {
      canonical: '/en/privacy',
      languages: {
        'en': '/en/privacy',
        'ja': '/ja/privacy',
        'zh': '/zh/privacy',
        'ru': '/ru/privacy',
      },
    },
    openGraph: {
      title: SeoData.privacy.title[lang],
      description: SeoData.privacy.description[lang],
      url: `https://aligator527.github.io/${lang}/privacy`,
      siteName: 'Wanya Group | ワニャグループ',
      images: `images/opengraph/homepage/${lang}/thumbnail.png`
    }
  }
}

export default function Privacy() {

  return (
    <>
      <Header />
      <Banner />
      <PrivacyPolicyContainer />
      <CookieConsentForm />
      <Footer />
    </>
  );
}