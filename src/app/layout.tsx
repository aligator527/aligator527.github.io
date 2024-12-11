import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Wanya Group | ワニャグループ",
  description: "Wanya Group specialize in professional system development, digital transformation (DX) solutions, and global business support. Websites, SaaS, mobile apps, CRM systems, DevOps, and multilingual applications. Empower your business with expert consulting and innovative technologies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>
          @import url(&apos;https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Noto+Sans+SC:wght@100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap&apos;);
        </style>
      </head>
      <body className={`antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
