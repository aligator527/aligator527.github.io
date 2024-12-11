import Banner from "@/components/banner";
import ContactForm from "@/components/contact";
import Footer from "@/components/footer";
import Header from "@/components/header";
import InfrastructureServiceContainer from "@/components/infrastructurecontainer";

// Predefine the supported languages
const supportedLanguages = ['en', 'ja', 'zh', 'ru'];

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default function ITDevelopmentService() {

  return (
    <>
      <Header />
      <Banner />
      <InfrastructureServiceContainer />
      <ContactForm />
      <Footer />
    </>
  );
}