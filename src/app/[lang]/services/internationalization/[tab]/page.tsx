import Banner from "@/components/banner";
import ContactForm from "@/components/contact";
import CookieConsentForm from "@/components/cookie";
import Footer from "@/components/footer";
import Header from "@/components/header";
import InternationalizationContainer from "@/components/internationalizationcontainer";

export function generateStaticParams() {
    const supportedLanguages = ['en', 'ja', 'zh', 'ru'];
    const tabs = ["japanese-company", "non-japanese-company", "work-in-japan"];
  
    // Flatten the combinations into a single array
    return supportedLanguages.flatMap((lang) => 
      tabs.map((tab) => ({
        lang,
        tab
      }))
    );
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