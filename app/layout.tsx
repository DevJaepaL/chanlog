import "./globals.css";
import localFont from "next/font/local";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AnalyticsWrapper } from "@/components/analytics";

const pretendard = localFont({
  src: [
    {
      path: "../public/fonts/Pretendard-Regular.woff2",
      weight: "400",
    },
    {
      path: "../public/fonts/Pretendard-SemiBold.woff2",
      weight: "600",
    },
    {
      path: "../public/fonts/Pretendard-Bold.woff2",
      weight: "700",
    },
    {
      path: "../public/fonts/Pretendard-Black.woff2",
      weight: "900",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://localhost"),
  title: {
    default: "Chanlog",
    template: "%s | Chanlog",
  },
  description: "순간을 기록하며 생각을 남기는 블로그",
  openGraph: {
    title: "Chanlog",
    description: "순간을 기록하며 생각을 남기는 블로그",
    url: "https://localhost",
    locale: "ko_KR",
    type: "website",
    siteName: "Chanlog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "standard",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${pretendard.variable} font-sans`}>
      <body className=" flex flex-col bg-white antialiased transition-colors delay-75">
          <Navbar />
          <main className="mx-auto mt-14 mb-14 w-full max-w-3xl px-4">
            {children}
          </main>
          <Footer />
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
