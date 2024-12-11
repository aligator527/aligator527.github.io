'use client';
import { useLanguage } from "@/context/languageContext";
import BannerData from "@/data/banner.json"
export default function HeroBanner() {
    const { language } = useLanguage();
    return (
        <div className="relative isolate px-6 pt-14 lg:px-8">
            <div className="mx-auto max-w-2xl">
                <div className="text-center">
                    <h1 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl"
                        dangerouslySetInnerHTML={ { __html: BannerData.heroBanner.title[language] } }>
                    </h1>
                    <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                        { BannerData.heroBanner.text[language] }
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a
                        href="#services"
                        className="rounded-md bg-[#59705b] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#59705b]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#59705b]"
                    >
                        Get started
                    </a>
                    <a href="#services" className="text-sm/6 font-semibold text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#59705b]">
                        Learn more <span aria-hidden="true">→</span>
                    </a>
                    </div>
                </div>
            </div>
        </div>
    )
}