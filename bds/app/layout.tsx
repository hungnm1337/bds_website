import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ConditionalHeader from "@/components/ConditionalHeader";
import FloatingContact from "@/components/FloatingContact";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.daidocdt.com'),
  title: "Đại Đô CĐT - Bất Động Sản Cao Cấp",
  description: "Chuyên tư vấn đầu tư bất động sản cao cấp, an toàn và sinh lời bền vững.",
  keywords: ["bất động sản", "đầu tư", "đại đô cđt", "bất động sản cao cấp", "giá chủ đầu tư"],
  openGraph: {
    title: "Đại Đô CĐT - Bất Động Sản Cao Cấp",
    description: "Chuyên tư vấn đầu tư bất động sản cao cấp, an toàn và sinh lời bền vững.",
    url: 'https://www.daidocdt.com',
    siteName: 'Đại Đô CĐT',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Đại Đô CĐT - Bất Động Sản Cao Cấp",
    description: "Chuyên tư vấn đầu tư bất động sản cao cấp, an toàn và sinh lời bền vững.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ConditionalHeader />
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
