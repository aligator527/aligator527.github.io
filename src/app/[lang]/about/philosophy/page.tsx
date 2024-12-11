import Banner from "@/components/banner";
import ContactForm from "@/components/contact";
import CookieConsentForm from "@/components/cookie";
import Footer from "@/components/footer";
import Header from "@/components/header";
import PhilosophyContainer from "@/components/philosophy";

// Predefine the supported languages
const supportedLanguages = ['en', 'ja', 'zh', 'ru'];

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
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