'use client';
import { useLanguage } from "@/context/languageContext";
import { BuildingOfficeIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { LanguageIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import servicesData from "@/data/services.json";

export default function ForNonJapaneseCompany() {
    const { language } = useLanguage();

    return (
        <div>
            <img src="/images/japan.png" alt={servicesData.services[4].title[language]} className="w-2/4 mx-auto" />
            <h1 className="text-5xl lg:text-6xl font-bold my-12 text-[#59705b]">{servicesData.services[4].title[language]}</h1>
            <h2 className="text-3xl font-semibold text-[#59705b]">{servicesData.services[4].subtitle[language]}</h2>
            <p className="my-12">{servicesData.services[4].description[language]}</p>
            <ul className="mlist-disc ml-8 text-lg">
                    {servicesData.services[4].list.map((item, index) => (
                        <li key={index} className="text-base text-gray-600">
                            {item.text[language]} {/* Localized list item */}
                        </li>
                    ))}
            </ul>
            <div className="p-12 my-8 bg-[#59705b]">
                <div className="text-white text-3xl font-bold mb-6 text-center lg:text-start">Flow of support</div>
                <div className="lg:flex">
                    <div className="px-8 py-2 bg-white text-center w-52 mx-auto">
                        <div className="text-[#59705b]">STEP 01</div>
                        <div className="my-6"><ChatBubbleLeftRightIcon className="text-[#59705b] w-8 mx-auto" /></div>
                        <div className="font-semibold">{servicesData.services[4].steps?.[0].title[language]}</div>
                        <div className="text-sm">{servicesData.services[4].steps?.[0].text[language]}</div>
                    </div>
                    <ChevronRightIcon className="lg:block hidden w-8 mx-2 text-white" />
                    <ChevronDownIcon className="block lg:hidden w-8 my-2 text-white mx-auto" />
                    <div className="px-8 py-2 bg-white text-center w-52 mx-auto">
                        <div className="text-[#59705b]">STEP 02</div>
                        <div className="my-6"><DocumentIcon className="text-[#59705b] w-8 mx-auto" /></div>
                        <div className="font-semibold">{servicesData.services[4].steps?.[1].title[language]}</div>
                        <div className="text-sm">{servicesData.services[4].steps?.[1].text[language]}</div>
                    </div>
                    <ChevronRightIcon className="lg:block hidden w-8 mx-2 text-white" />
                    <ChevronDownIcon className="block lg:hidden w-8 my-2 text-white mx-auto" />
                    <div className="px-8 py-2 bg-white text-center w-52 mx-auto">
                        <div className="text-[#59705b]">STEP 03</div>
                        <div className="my-6"><LanguageIcon className="text-[#59705b] w-8 mx-auto" /></div>
                        <div className="font-semibold">{servicesData.services[4].steps?.[2].title[language]}</div>
                        <div className="text-sm">{servicesData.services[4].steps?.[2].text[language]}</div>
                    </div>
                    <ChevronRightIcon className="lg:block hidden w-8 mx-2 text-white" />
                    <ChevronDownIcon className="block lg:hidden w-8 my-2 text-white mx-auto" />
                    <div className="px-8 py-2 bg-white text-center w-52 mx-auto">
                        <div className="text-[#59705b]">STEP 04</div>
                        <div className="my-6"><BuildingOfficeIcon className="text-[#59705b] w-8 mx-auto" /></div>
                        <div className="font-semibold">{servicesData.services[4].steps?.[3].title[language]}</div>
                        <div className="text-sm">{servicesData.services[4].steps?.[3].text[language]}</div>
                    </div>
                    <ChevronRightIcon className="lg:block hidden w-8 mx-2 text-white" />
                    <ChevronDownIcon className="block lg:hidden w-8 my-2 text-white mx-auto" />
                    <div className="px-8 py-2 bg-white text-center w-52 mx-auto">
                        <div className="text-[#59705b]">STEP 05</div>
                        <div className="my-6"><UserCircleIcon className="text-[#59705b] w-8 mx-auto" /></div>
                        <div className="font-semibold">{servicesData.services[4].steps?.[4].title[language]}</div>
                        <div className="text-sm">{servicesData.services[4].steps?.[4].text[language]}</div>
                    </div>
                </div>
            </div>
            <p className="my-12">{servicesData.description[language]}</p>
        </div>
    )
}