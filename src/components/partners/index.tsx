import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function PartnersCarousel() {
    const slides = [
        { src: '/images/nagashimapackaging.png', alt: 'Nagashima Packaging Co.,Ltd.' },
    ];

    const widthPercentage = slides.length === 1 ? 33.3 : slides.length === 2 ? 66.6 : 100;

    return (
        <div className="pt-56">
            <h2 className="text-2xl font-bold leading-tight text-center">
                Our Main Partner{slides.length > 1 ? "s" : ''}
            </h2>
            <div>
                <p className="text-gray-600 text-center mt-4">
                    We are proud to have a strong partnership with some of the most renowned brands in the industry.
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
