import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Wanya Group | ワニャグループ",
  description: "Wanya Group specialize in professional system development, digital transformation (DX) solutions, and global business support. Websites, SaaS, mobile apps, CRM systems, DevOps, and multilingual applications. Empower your business with expert consulting and innovative technologies",
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'ja': '/ja',
      'zh': '/zh',
      'ru': '/ru',
    },
  },
  openGraph: {
    title: 'Wanya Group | ワニャグループ',
    description: 'Wanya Group specialize in professional system development, digital transformation (DX) solutions, and global business support. Websites, SaaS, mobile apps, CRM systems, DevOps, and multilingual applications. Empower your business with expert consulting and innovative technologies',
    url: 'https://aligator527.github.io/',
    siteName: 'Wanya Group | ワニャグループ',
    images: '/images/layout-opengraph.png',
  }
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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-THDMME77PX"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-THDMME77PX');
          `,
        }}>
        </script>
      </head>
      <body className={`antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
