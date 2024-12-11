'use client';

import { useLanguage } from "@/context/languageContext";
import ProfileData from "@/data/profile.json";

export default function Profile() {
    const { language } = useLanguage();
    return (
        <div className="border rounded-md p-5 m-10 mx-auto max-w-3xl">
            <header className="text-center">
                {language !== "ja" ? (
                    <img
                        alt={ProfileData.profile.header.logoAlt[language]}
                        src="/images/logo-en.png"
                        className="h-4 w-auto"
                    />
                    ) : (
                    <img
                        alt={ProfileData.profile.header.logoAlt[language]}
                        src="/images/logo-ja.png"
                        className="h-6 w-auto"
                    />
                )}
                <h1 className="mt-2 text-lg font-semibold">{ProfileData.profile.header.title[language]}</h1>
            </header>
            <div className="mt-6">
                <table className="table-auto w-full border-collapse border border-gray-200 text-left">
                    <tbody>
                        <tr>
                            <td className="border border-gray-200 px-4 py-2">{ProfileData.profile.table.tradeName.label[language]}</td>
                            <td className="border border-gray-200 px-4 py-2">{ProfileData.profile.table.tradeName.value[language]}</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-200 px-4 py-2">{ProfileData.profile.table.status.label[language]}</td>
                            <td className="border border-gray-200 px-4 py-2">{ProfileData.profile.table.status.value[language]}</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-200 px-4 py-2">{ProfileData.profile.table.formation.label[language]}</td>
                            <td className="border border-gray-200 px-4 py-2">{ProfileData.profile.table.formation.value[language]}</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-200 px-4 py-2">{ProfileData.profile.table.representative.label[language]}</td>
                            <td className="border border-gray-200 px-4 py-2">{ProfileData.profile.table.representative.value[language]}</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-200 px-4 py-2">{ProfileData.profile.table.mainBank.label[language]}</td>
                            <td className="border border-gray-200 px-4 py-2">{ProfileData.profile.table.mainBank.value[language]}</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-200 px-4 py-2">{ProfileData.profile.table.telephone.label[language]}</td>
                            <td className="border border-gray-200 px-4 py-2">{ProfileData.profile.table.telephone.value[language]}</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-200 px-4 py-2">{ProfileData.profile.table.businessActivities.label[language]}</td>
                            <td className="border border-gray-200 px-4 py-2">
                                <ul className="list-disc pl-5">
                                    {ProfileData.profile.table.businessActivities.value[language].map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
