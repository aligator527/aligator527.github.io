'use client'

import { XMarkIcon } from '@heroicons/react/20/solid'
import Link from 'next/link';
import { useState } from 'react';
import BannerData from "@/data/banner.json";
import { useLanguage } from '@/context/languageContext';

export default function Banner() {
  const [isOpen, setIsOpen] = useState(true);
  const { language } = useLanguage();

  const generateHref = (language: string, path: string) => {
    // Ensure the path is correctly formatted with a leading '/'
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `/${language}${cleanPath}`;
  };

  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1" 
         style={{ opacity: isOpen ? 1 : 0,}}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm/6 text-gray-900">
          <strong className="font-semibold">{BannerData.banner.title[language]}</strong>
          <svg viewBox="0 0 2 2" aria-hidden="true" className="mx-2 inline size-0.5 fill-current">
            <circle r={1} cx={1} cy={1} />
          </svg>
          {BannerData.banner.description[language]}
        </p>
        <Link
          href={generateHref(language, "/contact")}
          className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          {BannerData.banner.button[language]} <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      <div className="flex flex-1 justify-end">
        <button onClick={() => {setIsOpen(false)}} type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
          <span className="sr-only">Dismiss</span>
          <XMarkIcon aria-hidden="true" className="size-5 text-gray-900" />
        </button>
      </div>
    </div>
  )
}