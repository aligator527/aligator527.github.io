'use client'

import { useState } from 'react'
import Link from 'next/link';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  CursorArrowRaysIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { BuildingOffice2Icon, ChatBubbleOvalLeftIcon, ChevronDownIcon, CloudIcon, CpuChipIcon, EnvelopeIcon, GlobeAltIcon, LanguageIcon, PhoneIcon } from '@heroicons/react/20/solid'

import { useLanguage } from '@/context/languageContext'
import headerData from "@/data/header.json"

type Language = "en" | "ja" | "zh" | "ru";
const languageTable: Record<Language, Record<Language, string>> = {
    "en": {
        "en": "English",
        "ja": "英語",
        "zh": "英语",
        "ru": "Английский"
    },
    "ja": {
        "en": "Japanese",
        "ja": "日本語",
        "zh": "日本语",
        "ru": "Японский"
    },
    "zh": {
        "en": "Chinese",
        "ja": "中国語",
        "zh": "中文",
        "ru": "Китайский"
    },
    "ru": {
        "en": "Russian",
        "ja": "ロシア語",
        "zh": "俄语",
        "ru": "Русский"
    }
}
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, setLanguage } = useLanguage();

  const services = [
    { name: headerData.services.list[0].title[language], description: headerData.services.list[0].description[language], href: headerData.services.list[0].href, icon: CpuChipIcon },
    { name: headerData.services.list[1].title[language], description: headerData.services.list[1].description[language], href: headerData.services.list[1].href, icon: CursorArrowRaysIcon },
    { name: headerData.services.list[2].title[language], description: headerData.services.list[2].description[language], href: headerData.services.list[2].href, icon: CloudIcon },
    { name: headerData.services.list[3].title[language], description: headerData.services.list[3].description[language], href: headerData.services.list[3].href, icon: GlobeAltIcon },
  ]
  const aboutus = [
      { name: headerData.about.list[0].title[language], description: headerData.about.list[0].description[language], href: headerData.about.list[0].href, icon: BuildingOffice2Icon },
      { name: headerData.about.list[1].title[language], description: headerData.about.list[1].description[language], href: headerData.about.list[1].href, icon: ChatBubbleOvalLeftIcon },
      { name: headerData.about.list[2].title[language], description: headerData.about.list[2].description[language], href: headerData.about.list[2].href, icon: EnvelopeIcon },
  ]
  const callsToAction = [
    { name: 'Contact sales', href: '/contact', icon: PhoneIcon },
  ]

  const options: [Language, string][] = Object.entries(languageTable[language])
    .map(([key, value]) => [key as Language, value]) as [Language, string][];

  const generateHref = (language: string, path: string) => {
      // Ensure the path is correctly formatted with a leading '/'
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `/${language}${cleanPath}`;
    };

  return (
    <header className="bg-white">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href={generateHref(language, "/")} className="-m-1.5 p-1.5">
            <span className="sr-only">Wanya Group</span>
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
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
              {headerData.services.title[language]}
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="p-4">
                {services.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                  >
                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-[#59705b]" />
                    </div>
                    <div className="flex-auto">
                      <Link href={generateHref(language, item.href)} className="block font-semibold text-gray-900">
                        {item.name}
                        <span className="absolute inset-0" />
                      </Link>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                {callsToAction.map((item) => (
                  <Link
                    key={item.name}
                    href={generateHref(language, item.href)}
                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                  >
                    <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
              {headerData.about.title[language]}
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="p-4">
                {aboutus.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                  >
                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-[#59705b]" />
                    </div>
                    <div className="flex-auto">
                      <Link href={generateHref(language, item.href)} className="block font-semibold text-gray-900">
                        {item.name}
                        <span className="absolute inset-0" />
                      </Link>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                {callsToAction.map((item) => (
                  <a
                    key={item.name}
                    href={generateHref(language, item.href)}
                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                  >
                    <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                    {item.name}
                  </a>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
          <Link href={generateHref(language, "/contact")} className="text-sm/6 font-semibold text-gray-900">
            {headerData.contact.title[language]}
          </Link>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <LanguageIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                      {languageTable[language][language]}
                    <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                    </MenuButton>
                </div>

                <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                    <div className="py-1">
                        {options.map(([key]) => {
                            const nativeVersion = languageTable[key][key];
                            return (
                                <MenuItem key={key}>
                                <a
                                    onClick={() => setLanguage(key)}
                                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                >
                                    {languageTable[key][language]} ({nativeVersion})
                                </a>
                                </MenuItem>
                            )
                        })}
                    </div>
                </MenuItems>
                </Menu>
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href={generateHref(language, "/")} className="-m-1.5 p-1.5">
              <span className="sr-only">Wanya Group</span>
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
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                      {headerData.about.title[language]}
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-[open]:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...aboutus, ...callsToAction].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={generateHref(language, item.href)}
                        className="block rounded-lg py-2 pl-6 pr-3 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                      {headerData.services.title[language]}
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-[open]:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...services, ...callsToAction].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={generateHref(language, item.href)}
                        className="block rounded-lg py-2 pl-6 pr-3 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <Link
                  href={generateHref(language, "/contact")}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  {headerData.contact.title[language]}
                </Link>
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                    Language
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-[open]:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                  {options.map(([key]) => {
                            const nativeVersion = languageTable[key][key];
                            return (
                                <DisclosureButton
                                    key={key}
                                    onClick={() => setLanguage(key)}
                                    className="block rounded-lg py-2 pl-6 pr-3 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    {languageTable[key][language]} ({nativeVersion})
                                </DisclosureButton>
                            )
                        })}
                  </DisclosurePanel>
                </Disclosure>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
