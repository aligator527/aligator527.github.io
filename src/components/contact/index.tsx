'use client';

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { Field, Label, Switch } from '@headlessui/react'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import ContactData from "@/data/contact.json";
import { useLanguage } from '@/context/languageContext';
import Link from 'next/link';

export default function ContactForm() {
    const [agreed, setAgreed] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { language } = useLanguage()

    const generateHref = (language: string, path: string) => {
        // Ensure the path is correctly formatted with a leading '/'
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `/${language}${cleanPath}`;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission

        if (!agreed) {
            setErrorMessage(ContactData.contactForm.validationMessage.privacy[language]);
            return;
        }

        setErrorMessage(""); // Clear previous error messages
        setSuccessMessage(""); // Clear previous success messages
        setIsSubmitting(true);

        const form = event.currentTarget;
        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                setSuccessMessage(ContactData.contactForm.successMessage[language]);
                form.reset(); // Reset form fields
                setAgreed(false); // Reset agreement toggle
            } else {
                const data = await response.json();
                setErrorMessage(data.error);
            }
        } catch (error) {
            setErrorMessage("Couldn't send message: " + error);
        } finally {
            setTimeout(() => setIsSubmitting(false), 3000); // Re-enable the button after 3 seconds
        }
    };

    return (
        <div className="lg:flex">
            <div className="lg:w-2/4 px-4 sm:px-6 lg:px-8">
                <h2 className="text-balance text-5xl font-semibold tracking-tight sm:text-7xl">
                    <span className="text-[#59705b]">{ContactData.contactForm.header[language]}</span>
                </h2>
                <div className='mt-10 w-3/4 font-light'>
                    {ContactData.contactForm.description[language]}
                </div>
                <div className='mt-10 text-gray-500'>
                    <div className='flex'>
                        <PhoneIcon className='h-8'/> <span className='ms-5'>+8180-4753-2781</span>
                    </div>
                    <div className='flex mt-4'>
                        <EnvelopeIcon className='h-8'/> <span className='ms-5'>aligator527official@gmail.com</span>
                    </div>
                </div>
            </div>
            <div>
            <form 
                id="ajax-connect"
                action="https://formsubmit.co/2cfd19313641e04aa8d5b991c8261479" 
                method="POST" 
                className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 pt-8 lg:pt-0"
                onSubmit={handleSubmit}
            >
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-900">
                            {ContactData.contactForm.form.labels.firstName[language]}
                        </label>
                        <div className="mt-2.5">
                            <input
                                id="first-name"
                                name="first-name"
                                type="text"
                                autoComplete="given-name"
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900">
                            {ContactData.contactForm.form.labels.lastName[language]}
                        </label>
                        <div className="mt-2.5">
                        <input
                            id="last-name"
                            name="last-name"
                            type="text"
                            autoComplete="family-name"
                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                        />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="company" className="block text-sm/6 font-semibold text-gray-900">
                            {ContactData.contactForm.form.labels.company[language]}
                        </label>
                        <div className="mt-2.5">
                        <input
                            id="company"
                            name="company"
                            type="text"
                            autoComplete="organization"
                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                        />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">
                            {ContactData.contactForm.form.labels.email[language]}
                        </label>
                        <div className="mt-2.5">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                        />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="phone-number" className="block text-sm/6 font-semibold text-gray-900">
                            {ContactData.contactForm.form.labels.phoneNumber[language]}
                        </label>
                        <div className="mt-2.5">
                        <div className="flex rounded-md bg-white outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                            <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                            <select
                                id="country"
                                name="country"
                                autoComplete="country"
                                aria-label="Country"
                                className="col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pl-3.5 pr-7 text-base text-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            >
                                <option>JP</option>
                                <option>US</option>
                                <option>CA</option>
                                <option>GR</option>
                                <option>BR</option>
                                <option>CN</option>
                                <option>RU</option>
                                <option>KR</option>
                            </select>
                            <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            />
                            </div>
                            <input
                                id="phone-number"
                                name="phone-number"
                                type="text"
                                placeholder="123-456-7890"
                                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                            />
                        </div>
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900">
                            {ContactData.contactForm.form.labels.message[language]}
                        </label>
                        <div className="mt-2.5">
                            <textarea
                                id="message"
                                name="message"
                                rows={4}
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                defaultValue={''}
                            />
                        </div>
                    </div>
                    <Field className="flex gap-x-4 sm:col-span-2">
                        <div className="flex h-6 items-center">
                        <Switch
                            checked={agreed}
                            onChange={setAgreed}
                            className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#59705b] data-[checked]:bg-[#59705b]"
                        >
                            <span className="sr-only">Agree to policies</span>
                            <span
                                aria-hidden="true"
                                className="size-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                            />
                        </Switch>
                        </div>
                        <Label className="text-sm/6 text-gray-600">
                            {ContactData.contactForm.form.privacyPolicy.text[language]} {' '}
                        <Link href={generateHref(language, "/privacy")} className="font-semibold text-[#59705b]">
                            {ContactData.contactForm.form.privacyPolicy.linkText[language]}
                        </Link>
                        </Label>
                    </Field>
                </div>
                {errorMessage && (
                    <div className="mt-2 text-sm text-red-600">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="mt-2 text-sm text-green-600">
                        {successMessage}
                    </div>
                )}
                <div className="mt-10">
                    <button
                        type="submit"
                        className={`block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm ${
                            isSubmitting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#59705b] hover:bg-[#59705b]/90"
                        }`}
                    >
                        {ContactData.contactForm.form.button[language]}
                    </button>
                </div>
            </form>
            </div>
        </div>
    )
}