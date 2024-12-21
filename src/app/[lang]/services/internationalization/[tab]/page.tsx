import Banner from "@/components/banner";
import ContactForm from "@/components/contact";
import CookieConsentForm from "@/components/cookie";
import Footer from "@/components/footer";
import Header from "@/components/header";
import InternationalizationContainer from "@/components/internationalizationcontainer";
import SeoData from "@/data/seo.json";


const supportedLanguages = ['en', 'ja', 'zh', 'ru'] as const;
type SupportedLanguage = typeof supportedLanguages[number];

export function generateStaticParams() {
    const tabs = ["japanese-company", "non-japanese-company", "work-in-japan"];
  
    // Flatten the combinations into a single array
    return supportedLanguages.flatMap((lang) => 
      tabs.map((tab) => ({
        lang,
        tab
      }))
    );
  }
  
export async function generateMetadata({
    params,
  }: {
    params: Promise<{ lang: SupportedLanguage; tab: string }>; // Awaitable params
  }) {
    // Read route params
    const { lang, tab } = await params;
  
    // Retrieve metadata based on the tab and language
    const tabKey: keyof typeof SeoData = tab as keyof typeof SeoData; // Cast tab to match the keys of SeoData
  
    if (!SeoData[tabKey]) {
      throw new Error(`Invalid tab key: ${tab}`);
    }
  
    return {
      title: SeoData[tabKey]?.title[lang],
      description: SeoData[tabKey]?.description[lang],
      keywords: SeoData[tabKey]?.keywords[lang],
      alternates: {
        canonical: `/en/services/internationalization/${tabKey}`,
        languages: {
          'en': `/en/services/internationalization/${tabKey}`,
          'ja': `/en/services/internationalization/${tabKey}`,
          'zh': `/en/services/internationalization/${tabKey}`,
          'ru': `/en/services/internationalization/${tabKey}`,
        },
      },
      openGraph: {
        title: SeoData[tabKey]?.title[lang],
        description: SeoData[tabKey]?.description[lang],
        url: `https://aligator527.github.io/${lang}/services/internationalization/${tabKey}`,
        siteName: 'Wanya Group | ワニャグループ',
        images: `images/opengraph/homepage/${lang}/thumbnail.png`
      },
    };
  }

export default async function InternationalizationService({
    params,
}: {
    params: Promise<{ lang: string; tab: string }>; // Awaitable params
}) {
    const { tab } = await params;

  return (
    <>
      <Header />
      <Banner />
      <InternationalizationContainer initialSelectedTab={tab} />
      <ContactForm />
      <CookieConsentForm />
      <Footer />
    </>
  );
}