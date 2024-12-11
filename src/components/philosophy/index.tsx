'use client';
import { useLanguage } from "@/context/languageContext";
import PhilosophyData from "@/data/philosophy.json";

export default function PhilosophyContainer() {
    const { language } = useLanguage();
    return (
        <div className="my-12 px-4 sm:px-6 lg:px-8">
            <div className="my-12">
                <h2 className="text-5xl font-bold text-[#59705b]">{PhilosophyData.philosophy.mission.title[language]}</h2>
                <h3 className="text-4xl font-semibold my-5">{PhilosophyData.philosophy.mission.subtitle[language]}</h3>
                <p>
                    {PhilosophyData.philosophy.mission.text[language]}
                </p>
            </div>
            <div className="my-12">
                <h2 className="text-5xl font-bold text-[#59705b]">{PhilosophyData.philosophy.vision.title[language]}</h2>
                <h3 className="text-4xl font-semibold my-5">{PhilosophyData.philosophy.vision.subtitle[language]}</h3>
                <p>
                    {PhilosophyData.philosophy.vision.text[language]}
                </p>
            </div>
            <div className="my-12">
                <h2 className="text-5xl font-bold text-[#59705b]">{PhilosophyData.philosophy.values.title[language]}</h2>
                <h3 className="text-4xl font-semibold my-5">{PhilosophyData.philosophy.values.subtitle[language]}</h3>
                <p>
                    {PhilosophyData.philosophy.values.text[language]}
                </p>
            </div>
            <div className="my-12">
                <h2 className="text-5xl font-bold text-[#59705b]">{PhilosophyData.philosophy.slogan.title[language]}</h2>
                <h3 className="text-4xl font-semibold my-5">{PhilosophyData.philosophy.slogan.subtitle[language]}</h3>
                <p>
                    {PhilosophyData.philosophy.slogan.text[language]}
                </p>
            </div>
        </div>
    );
}
