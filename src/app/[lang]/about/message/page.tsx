import Banner from "@/components/banner";
import ContactForm from "@/components/contact";
import CookieConsentForm from "@/components/cookie";
import Footer from "@/components/footer";
import Header from "@/components/header";
import RepresentativeMessage from "@/components/representative-message";
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
    title: SeoData.message.title[lang],
    description: SeoData.message.description[lang],
    keywords: SeoData.message.keywords[lang],
    alternates: {
      canonical: '/en/about/message',
      languages: {
        'en': '/en/about/message',
        'ja': '/ja/about/message',
        'zh': '/zh/about/message',
        'ru': '/ru/about/message',
      },
    },
    openGraph: {
      title: SeoData.message.title[lang],
      description: SeoData.message.description[lang],
      url: `https://aligator527.github.io/${lang}/about/message`,
      siteName: 'Wanya Group | ワニャグループ',
      images: `images/opengraph/homepage/${lang}/thumbnail.png`
    }
  }
}

export default function Message() {

    return (
      <>
        <Header />
        <Banner />
        <RepresentativeMessage />
        <ContactForm />
        <CookieConsentForm />
        <Footer />
      </>
    );
  }