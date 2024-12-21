import Banner from "@/components/banner";
import ContactForm from "@/components/contact";
import CookieConsentForm from "@/components/cookie";
import Footer from "@/components/footer";
import Header from "@/components/header";
import PhilosophyContainer from "@/components/philosophy";
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
    title: SeoData.philosophy.title[lang],
    description: SeoData.philosophy.description[lang],
    keywords: SeoData.philosophy.keywords[lang],
    alternates: {
      canonical: '/en/about/philosophy',
      languages: {
        'en': '/en/about/philosophy',
        'ja': '/ja/about/philosophy',
        'zh': '/zh/about/philosophy',
        'ru': '/ru/about/philosophy',
      },
    },
    openGraph: {
      title: SeoData.philosophy.title[lang],
      description: SeoData.philosophy.description[lang],
      url: `https://aligator527.github.io/${lang}/about/philosophy`,
      siteName: 'Wanya Group | ワニャグループ',
      images: `images/opengraph/homepage/${lang}/thumbnail.png`
    }
  }
}

export default function Philosophy() {

  return (
    <>
      <Header />
      <Banner />
      <PhilosophyContainer />
      <ContactForm />
      <CookieConsentForm />
      <Footer />
    </>
  );
}