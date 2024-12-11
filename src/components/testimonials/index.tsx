'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import TestimonialsData from "@/data/testimonials.json";
import { useLanguage } from '@/context/languageContext';

export default function TestimonialsCarousel() {
    const { language } = useLanguage();
    const slides = TestimonialsData.testimonials;

    return (
        <section className="relative py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 
                    className="text-balance text-5xl font-semibold tracking-tight lg:w-3/4 sm:text-7xl"
                    dangerouslySetInnerHTML={{ __html: TestimonialsData.title[language]}}>
                </h2>
            </div>
            <div className="pt-10 px-4 sm:px-6 lg:px-8">
                <Swiper
                    spaceBetween={50}
                    centeredSlides={true}
                    breakpoints={{
                        // Small screens (e.g., smartphones)
                        0: {
                            slidesPerView: 1,
                        },
                        // Large screens (e.g., desktops and tablets)
                        1024: {
                            slidesPerView: 2,
                        },
                    }}
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index} className="border p-4 lg:p-16">
                            <p className="text-xl font-medium">
                                ❝{slide.testimonial[language]}❞
                            </p>
                            <p className="text-xl mt-5">
                                {slide.title[language]}
                            </p>
                            <div className='mt-10'>
                                {slide.icon ? 
                                    (<img src={slide.icon} className='h-12' alt={slide.title[language]} />) : 
                                    TestimonialsData.noicon_title[language]
                                }
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
