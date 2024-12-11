'use client'
import { useLanguage } from "@/context/languageContext"
import RepresentativeData from "@/data/representative.json"

export default function RepresentativeMessage() {
    const { language } = useLanguage()
    return (
        <section className="relative my-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 
                    className="text-balance text-5xl font-semibold tracking-tight lg:w-3/4 sm:text-7xl"
                    dangerouslySetInnerHTML={{ __html: RepresentativeData.title[language] }}>
                </h2>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex my-10">
                {/* Left panel with Image */}
                <div className="">
                    <img 
                        src="/images/representative.jpg"
                        className="h-96"
                        alt="Ivan Dolgov"
                    />
                    <div className="mt-3 font-light text-sm">
                        {RepresentativeData.subtitle[language]}
                    </div>
                </div>

                {/* Right panel with description */}
                <div
                    className="lg:w-3/5 text-lg font-light mt-8 lg:mt-0 lg:ms-10 border rounded border-gray-500 p-5"
                    dangerouslySetInnerHTML={{ __html: RepresentativeData.text[language] }}
                >
                </div>
            </div>
        </section>
    )
}