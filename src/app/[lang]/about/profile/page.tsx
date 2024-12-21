import Banner from "@/components/banner";
import ContactForm from "@/components/contact";
import CookieConsentForm from "@/components/cookie";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Profile from "@/components/profile";
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
    title: SeoData.profile.title[lang],
    description: SeoData.profile.description[lang],
    keywords: SeoData.profile.keywords[lang],
    alternates: {
      canonical: '/en/about/profile',
      languages: {
        'en': '/en/about/profile',
        'ja': '/ja/about/profile',
        'zh': '/zh/about/profile',
        'ru': '/ru/about/profile',
      },
    },
    openGraph: {
      title: SeoData.profile.title[lang],
      description: SeoData.profile.description[lang],
      url: `https://aligator527.github.io/${lang}/about/profile`,
      siteName: 'Wanya Group | ワニャグループ',
      images: `images/opengraph/homepage/${lang}/thumbnail.png`
    }
  }
}

export default function ProfilePage() {

  return (
    <>
      <Header />
      <Banner />
      <Profile />
      <ContactForm />
      <CookieConsentForm />
      <Footer />
    </>
  );
}
