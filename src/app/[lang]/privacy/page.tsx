import Banner from "@/components/banner";
import Footer from "@/components/footer";
import Header from "@/components/header";
import PrivacyPolicyContainer from "@/components/privacypolicy";

// Predefine the supported languages
const supportedLanguages = ['en', 'ja', 'zh', 'ru'];

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default function Privacy() {

  return (
    <>
      <Header />
      <Banner />
      <PrivacyPolicyContainer />
      <Footer />
    </>
  );
}