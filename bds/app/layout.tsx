import type { Metadata } from "next";
import { Geist } from "next/font/google";
import ConditionalHeader from "@/components/ConditionalHeader";
import FloatingContact from "@/components/FloatingContact";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const BASE_URL = 'https://www.daidocdt.com'

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Nguyễn Văn Đô - Đại Đô CĐT',
  description: 'Chuyên tư vấn đầu tư bất động sản cao cấp, an toàn và sinh lời bền vững tại Bắc Ninh.',
  url: BASE_URL,
  telephone: '+84776236863',
  email: 'contact@nguyenvando.vn',
  image: `${BASE_URL}/logo1.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '48+50 Nguyễn Thị Minh Khai',
    addressLocality: 'Bắc Giang',
    addressRegion: 'Bắc Ninh',
    addressCountry: 'VN',
  },
  areaServed: 'Bắc Ninh',
  priceRange: '$$',
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Đại Đô CĐT - Bất Động Sản Cao Cấp",
  description: "Chuyên tư vấn đầu tư bất động sản cao cấp, an toàn và sinh lời bền vững tại Bắc Ninh.",
  keywords: ["bất động sản", "đầu tư", "đại đô cđt", "bất động sản cao cấp", "giá chủ đầu tư", "bất động sản Bắc Ninh"],
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: 'tUmr231wzIkfWeLmsJEhpuxbMpxJzROz0uYWN5ZzOS0',
  },
  openGraph: {
    title: "Đại Đô CĐT - Bất Động Sản Cao Cấp",
    description: "Chuyên tư vấn đầu tư bất động sản cao cấp, an toàn và sinh lời bền vững tại Bắc Ninh.",
    url: BASE_URL,
    siteName: 'Đại Đô CĐT',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/logo1.png',
        width: 1200,
        height: 630,
        alt: 'Đại Đô CĐT - Bất Động Sản Cao Cấp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Đại Đô CĐT - Bất Động Sản Cao Cấp",
    description: "Chuyên tư vấn đầu tư bất động sản cao cấp, an toàn và sinh lời bền vững tại Bắc Ninh.",
    images: ['/logo1.png'],
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
      className={`${geistSans.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ConditionalHeader />
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
