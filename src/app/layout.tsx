import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/app-layout";
import ReactLenis from "lenis/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tiktok Live Monitoring",
  description: "TikTok live monitoring tool to provide unparalleled insights and unparalleled control over live broadcasts. Monitor key performance indicators, manage comments, analyze audience engagement, and make informed adjustments to optimize your live stream's impact. With our intelligent features and powerful analytics, you'll be able to elevate your TikTok presence and captivate your audience like never before",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReactLenis

        root>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >

          <AppLayout>
            {children}
          </AppLayout>
        </body>
      </ReactLenis>
    </html>
  );
}
