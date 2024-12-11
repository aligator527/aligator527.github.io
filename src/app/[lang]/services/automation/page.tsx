import Banner from "@/components/banner";
import ContactForm from "@/components/contact";
import DxServiceContainer from "@/components/dxcontainer";
import Footer from "@/components/footer";
import Header from "@/components/header";

// Predefine the supported languages
const supportedLanguages = ['en', 'ja', 'zh', 'ru'];

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default function DXService() {

  return (
    <>
      <Header />
      <Banner />
      <DxServiceContainer />
      <ContactForm />
      <Footer />
    </>
  );
}