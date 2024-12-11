import Banner from "@/components/banner";
import ContactForm from "@/components/contact";
import Footer from "@/components/footer";
import Header from "@/components/header";

// Predefine the supported languages
const supportedLanguages = ['en', 'ja', 'zh', 'ru'];

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default function Contact() {

  return (
    <>
      <Header />
      <Banner />
      <ContactForm />
      <Footer />
    </>
  );
}