"use client";
import { useState } from "react";
import servicesData from "@/data/services.json"; // Adjust the path as needed
import { useLanguage } from "@/context/languageContext";

export default function ServicesPanel() {
    const { language } = useLanguage();

    // Set default hovered item to the first service
    const [hoveredItem, setHoveredItem] = useState<number>(0);

    return (
        <section className="relative my-20 py-20 bg-gray-100" id="services">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex">
                {/* Left panel with list items */}
                <div className="lg:w-2/5">
                    <h2 className="text-xl font-bold text-[#59705b] tracking-tight">
                        {servicesData.title[language]} {/* Localized title */}
                    </h2>
                    <div className="mt-10">
                        <ul className="space-y-6 text-4xl text-slate-300">
                            {servicesData.services.map((service, index) => (
                                <li key={index}>
                                    <span
                                        className={`cursor-pointer ease-in duration-700 ${
                                            index === hoveredItem ? "text-[#59705b]" : "text-slate-300"
                                        }`}
                                        onMouseEnter={() => setHoveredItem(index)}
                                        onClick={() => setHoveredItem(index)}
                                    >
                                        {service.title[language]} {/* Localized service title */}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right panel with description */}
                <div
                    key={hoveredItem} // Ensure re-render on hoveredItem change
                    className="mt-8 text-lg text-gray-700 animate-fade-in lg:w-3/5"
                >
                    <p className="mt-4">
                        {servicesData.services[hoveredItem].description[language]} {/* Localized description */}
                    </p>
                </div>
            </div>
        </section>
    );
}
