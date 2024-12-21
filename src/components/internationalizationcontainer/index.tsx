'use client';
import { useEffect, useState } from "react";
import ForJapaneseCompany from "../jpcompany";
import { useLanguage } from "@/context/languageContext";
import ForNonJapaneseCompany from "../nonjpcompany";
import WorkInJapan from "../workinJapan";

interface InternationalizationContainerProps {
    initialSelectedTab?: string; // Rename the prop for clarity
  }
  
  export default function InternationalizationContainer({
    initialSelectedTab,
  }: InternationalizationContainerProps) {
    const { language } = useLanguage();
  
    const tabs = ["Japanese Company", "Non-Japanese Company", "Work in Japan"];
    type TabType = typeof tabs[number];
  
    const tabUrls: Record<TabType, string> = {
      "Japanese Company": "/japanese-company",
      "Non-Japanese Company": "/non-japanese-company",
      "Work in Japan": "/work-in-japan",
    };

    const tabTranslations: Record<TabType, Record<string, string>> = {
        "Japanese Company": {
          en: "Japanese Company",
          ja: "日本企業",
          zh: "日本公司",
          ru: "Японская компания",
        },
        "Non-Japanese Company": {
          en: "Non-Japanese Company",
          ja: "非日本企業",
          zh: "非日本公司",
          ru: "Иностранная компания",
        },
        "Work in Japan": {
          en: "Work in Japan",
          ja: "日本で働く",
          zh: "在日本工作",
          ru: "Работа в Японии",
        },
    }
  
    // Determine the default tab based on the language if no tab is explicitly provided
    const defaultTab =
      language === "ja" ? tabs[0] : tabs[1]; // Default: Japanese Company for Japanese, Non-Japanese Company otherwise
  
    // State to manage the currently selected tab
    const [selectedTab, setSelectedTab] = useState<TabType>(
      (initialSelectedTab && tabs.find((tab) => tabUrls[tab] === `/${initialSelectedTab}`)) || defaultTab
    );
  
    useEffect(() => {
      // Update the URL when the selectedTab changes
      updateUrl(selectedTab);
    }, [selectedTab]);
  
    const updateUrl = (tab: TabType) => {
      const newUrl = tabUrls[tab];
      if (newUrl) {
        const baseUrl = `/${language}/services/internationalization`;
        window.history.pushState(null, "", `${baseUrl}${newUrl}`); // Change the URL without reloading the page
      }
    };
  
    return (
      <div>
        <div className="flex items-center justify-center font-light my-4">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`
                px-4 py-2 border ease-in duration-500
                ${selectedTab === tab ? "bg-[#59705b]" : "bg-slate-100"} 
                ${selectedTab === tab ? "text-white" : "text-gray-600"}
                ${index === 0 ? "rounded-s-full" : ""}
                ${index === tabs.length - 1 ? "rounded-e-full" : ""}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tabTranslations[tab][language] || tabTranslations[tab].en}
            </button>
          ))}
        </div>
        <div className="px-4 sm:px-6 lg:px-8 my-12">
          {selectedTab === tabs[0] && <ForJapaneseCompany />}
          {selectedTab === tabs[1] && <ForNonJapaneseCompany />}
          {selectedTab === tabs[2] && <WorkInJapan />}
        </div>
      </div>
    );
  }