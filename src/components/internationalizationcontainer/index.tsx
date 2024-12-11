'use client';
import { useLanguage } from "@/context/languageContext";
import servicesData from "@/data/services.json";

export default function InternationalizationContainer() {
    const { language } = useLanguage();
    return (
        <div>
            <img src="/images/internationalization.png" alt={servicesData.services[3].title[language]} className="w-2/4 mx-auto" />
            <div className="px-4 sm:px-6 lg:px-8 my-12">
                <h1 className="text-5xl lg:text-6xl font-bold my-12 text-[#59705b]">{servicesData.services[3].title[language]}</h1>
                <h2 className="text-3xl font-semibold text-[#59705b]">{servicesData.services[3].subtitle[language]}</h2>
                <p className="my-12">{servicesData.services[3].description[language]}</p>
                <ul className="mlist-disc ml-8 text-lg">
                        {servicesData.services[3].list.map((item, index) => (
                            <li key={index} className="text-base text-gray-600">
                                {item.text[language]} {/* Localized list item */}
                            </li>
                        ))}
                </ul>
                <p className="my-12">{servicesData.description[language]}</p>
            </div>
        </div>
    )
}