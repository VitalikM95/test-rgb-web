import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SWRConfig } from "swr";
import "./globals.css";
import { Navigation } from "@/components/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRM System - Управління клієнтами та угодами",
  description: "Система управління клієнтами та їх угодами",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
          }}
        >
          <Navigation />
          {children}
        </SWRConfig>
      </body>
    </html>
  );
}
