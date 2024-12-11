import Banner from "@/components/banner";
import ContactForm from "@/components/contact";
import CookieConsentForm from "@/components/cookie";
import Footer from "@/components/footer";
import Header from "@/components/header";
import RepresentativeMessage from "@/components/representative-message";

// Predefine the supported languages
const supportedLanguages = ['en', 'ja', 'zh', 'ru'];

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
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