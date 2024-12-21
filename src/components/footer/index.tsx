'use client'
import { useLanguage } from "@/context/languageContext";
import FooterData from "@/data/footer.json";
import Link from "next/link";

export default function Footer() {
    const { language } = useLanguage();

    const generateHref = (language: string, path: string) => {
        // Ensure the path is correctly formatted with a leading '/'
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `/${language}${cleanPath}`;
    };

    return (
        <footer className="bg-[#59705b]/10 text-center text-surface/75 lg:text-left mt-10">
            <div className="mx-6 py-10 text-center md:text-left">
                <div className="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="">
                        <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
                        {language !== "ja" ? (
                            <img
                                alt=""
                                src="/images/logo-en.png"
                                className="h-4 w-auto"
                            />
                            ) : (
                            <img
                                alt=""
                                src="/images/logo-ja.png"
                                className="h-6 w-auto"
                            />
                        )}
                        </h6>
                        <p>
                            {FooterData.footer.description[language]}
                        </p>
                    </div>
                    <div>
                        <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                            {FooterData.footer.sections.services.title[language]}
                        </h6>
                        <p className="mb-4">
                        <Link href={generateHref(language, "/services/development")}>
                            {FooterData.footer.sections.services.links.itDevelopment[language]}
                        </Link>
                        </p>
                        <p className="mb-4">
                            <Link href={generateHref(language, "/services/automation")}>
                                {FooterData.footer.sections.services.links.dxAutomation[language]}
                            </Link>
                        </p>
                        <p className="mb-4">
                            <Link href={generateHref(language, "/services/infrastructure")}>
                                {FooterData.footer.sections.services.links.cloudInfrastructure[language]}
                            </Link>
                        </p>
                        <p>
                            <Link href={generateHref(language, "/services/internationalization")}>
                                {FooterData.footer.sections.services.links.internationalization[language]}
                            </Link>
                        </p>
                    </div>
                    <div>
                        <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                            {FooterData.footer.sections.usefulLinks.title[language]}
                        </h6>
                        <p className="mb-4">
                        <Link href={generateHref(language, "/about/profile")}>
                            {FooterData.footer.sections.usefulLinks.links.profile[language]}
                        </Link>
                        </p>
                        <p className="mb-4">
                        <Link href={generateHref(language, "/about/profile")}>
                            {FooterData.footer.sections.usefulLinks.links.philosophy[language]}
                        </Link>
                        </p>
                        <p className="mb-4">
                        <Link href={generateHref(language, "/about/message")}>
                            {FooterData.footer.sections.usefulLinks.links.representativeMessage[language]}
                        </Link>
                        </p>
                        <p>
                        <Link href={generateHref(language, "/privacy")}>
                            {FooterData.footer.sections.usefulLinks.links.privacyPolicy[language]}
                            </Link>
                        </p>
                    </div>
                    <div>
                        <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                            {FooterData.footer.sections.contact.title[language]}
                        </h6>
                        <p className="mb-4 flex items-center justify-center md:justify-start">
                        <span className="me-3 [&>svg]:h-5 [&>svg]:w-5">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                            <path
                                d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                            </svg>
                        </span>
                            aligator527official@gmail.com
                        </p>
                        <p className="mb-4 flex items-center justify-center md:justify-start">
                        <span className="me-3 [&>svg]:h-5 [&>svg]:w-5">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                                clipRule="evenodd" />
                            </svg>
                        </span>
                            + 8180-4753-2781
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-[#59705b]/50 p-6 text-center">
                <span>{FooterData.footer.copyright[language]}</span>
                <a className="font-semibold" href="https://tw-elements.com/">
                {FooterData.footer.companyName[language]}</a>
            </div>
        </footer>
    )
}