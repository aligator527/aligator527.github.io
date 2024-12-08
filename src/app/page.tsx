"use client"
import Banner from '@/components/banner';
import ContactForm from '@/components/contact';
import Header from '@/components/header';
import HeroBanner from '@/components/hero-banner';
import PartnersCarousel from '@/components/partners';
import RepresentativeMessage from '@/components/representative-message';
import ServicesPanel from '@/components/services';
import TestimonialsCarousel from '@/components/testimonials';

export default function Home() {
  return (
    <>
      <Header />
      <Banner />
      <HeroBanner />
      <PartnersCarousel />
      <ServicesPanel />
      <TestimonialsCarousel />
      <RepresentativeMessage />
      <ContactForm />
    </>
  );
}
