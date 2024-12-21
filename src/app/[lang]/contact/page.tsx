import Banner from "@/components/banner";
import ContactForm from "@/components/contact";
import CookieConsentForm from "@/components/cookie";
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
    title: SeoData.contact.title[lang],
    description: SeoData.contact.description[lang],
    keywords: SeoData.contact.keywords[lang],
    alternates: {
      canonical: '/en/contact',
      languages: {
        'en': '/en/contact',
        'ja': '/ja/contact',
        'zh': '/zh/contact',
        'ru': '/ru/contact',
      },
    },
    openGraph: {
      title: SeoData.contact.title[lang],
      description: SeoData.contact.description[lang],
      url: `https://aligator527.github.io/${lang}/contact/`,
      siteName: 'Wanya Group | ワニャグループ',
      images: `images/opengraph/homepage/${lang}/thumbnail.png`
    }
  }
}

export default function Contact() {

  return (
    <>
      <Header />
      <Banner />
      <ContactForm />
      <CookieConsentForm />
      <Footer />
    </>
  );
}