'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import PartnersData from "@/data/partners.json";
import { useLanguage } from '@/context/languageContext';

export default function PartnersCarousel() {
    const { language } = useLanguage();
    const slides = PartnersData.partners;

    const widthPercentage = slides.length === 1 ? 33.3 : slides.length === 2 ? 66.6 : 100;

    return (
        <div className="pt-56">
            <h2 className="text-2xl font-bold leading-tight text-center">
                {PartnersData.title[language]}
            </h2>
            <div>
                <p className="text-gray-600 text-center mt-4">
                    {PartnersData.description[language]}
                </p>
            </div>
            <div className='pt-10'>
                <Swiper
                    spaceBetween={50}
                    slidesPerView={slides.length < 3 ? slides.length : 3}
                    centeredSlides={true}
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={slide.src}
                                alt={slide.alt}
                                style={{ width: `${widthPercentage}%` }}
                                className="object-cover mx-auto h-full"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
