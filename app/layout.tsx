import type { Metadata } from "next";
import { Syne, Geist } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Padel Gravity | Subotica, Srbija",
    template: "%s | Padel Gravity"
  },
  description: "Doživite vrhunsku padel kulturu u Padel Gravity Subotica. 4 moderna terena, premium kafić i živopisna zajednica.",
  applicationName: "Padel Gravity",
  authors: [{ name: "Padel Gravity Tim" }],
  generator: "Next.js",
  keywords: ["Padel", "Subotica", "Padel Gravity", "Sportovi", "Srbija", "Padel tereni", "Padel klub", "padel teren Subotica", "rezervacija padel Subotica", "padel klub Subotica"],
  referrer: "origin-when-cross-origin",
  creator: "Padel Gravity",
  publisher: "Padel Gravity",
  openGraph: {
    title: "Padel Gravity | Subotica, Srbija",
    description: "Doživite vrhunsku padel kulturu u Padel Gravity Subotica. 4 moderna terena, premium kafić i živopisna zajednica.",
    url: "https://padelgravity.rs",
    siteName: "Padel Gravity",
    locale: "sr_RS",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Padel Gravity Subotica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Padel Gravity | Subotica, Srbija",
    description: "Doživite vrhunsku padel kulturu u Padel Gravity Subotica. 4 moderna terena, premium kafić i živopisna zajednica.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://padelgravity.rs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body
        className={`${syne.variable} ${geist.variable} font-sans antialiased bg-black text-white selection:bg-lime-400 selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}
