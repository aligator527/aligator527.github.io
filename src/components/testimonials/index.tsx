import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function TestimonialsCarousel() {
    const slides = [
        {
            testimonial: 'His work efficiency was consistently excellent, and he completed all tasks within the deadlines. Additionally, he was proactive in sharing his opinions when solving problems, making significant contributions to the project. Thank you very much, Ivan.',
            title: 'Hayato Shiina, Project Manager, Marvel Co., Ltd',
            icon: "/images/marvel-logo.png",
        },
        {
            testimonial: 'His attention to detail and dedication to quality were remarkable. He not only met all deadlines but also took the initiative to improve processes, which greatly enhanced the team\'s workflow.',
            title: 'Ihor Vasin, Client',
            icon: "",
        },
        {
            testimonial: 'His ability to adapt to challenges and maintain excellent productivity was impressive. He showed great initiative in problem-solving and consistently met deadlines with well-executed work.',
            title: 'Roman, Individual Enterpreneur',
            icon: "",
        },
    ];

    return (
        <section className="relative py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-balance text-5xl font-semibold tracking-tight lg:w-3/4 sm:text-7xl">
                    <span className="text-[#59705b]">Wanya Group</span> is the Guide to the New Age of IT
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
                                ❝{slide.testimonial}❞
                            </p>
                            <p className="text-xl mt-5">
                                {slide.title}
                            </p>
                            <div className='mt-10'>
                                {slide.icon ? 
                                    (<img src={slide.icon} className='h-12' alt={slide.title} />) : 
                                    "There are no logo!"
                                }
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
