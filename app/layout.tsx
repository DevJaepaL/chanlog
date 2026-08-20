import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AnalyticsWrapper } from "@/components/analytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MotionProvider } from "@/components/ui/motion-provider";

const SITE_URL = "https://chanlog.blog";
const SITE_DESCRIPTION = "서버·AI 데이터 파이프라인을 만드는 백엔드 개발자 이재찬입니다.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "이재찬 | Backend & AI Engineer",
    template: "%s | Chanlog",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "이재찬 | Backend & AI Engineer",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
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
    <html lang="ko" className="font-sans">
      <head>
        <link
          rel="preload"
          href="/fonts/Pretendard-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Pretendard-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-canvas-soft text-ink antialiased">
        <Navbar />
        <main className="flex-1">
          <MotionProvider>{children}</MotionProvider>
        </main>
        <Footer />
        <AnalyticsWrapper />
        <SpeedInsights />
      </body>
    </html>
  );
}
