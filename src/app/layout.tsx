import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PeriyotLab | Chemical Products Platform",
  description: "Browse, view, and manage chemical products.",
};

import { ConditionalHeader, ConditionalFooter } from "@/components/layout/ConditionalLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <ConditionalHeader><Navbar /></ConditionalHeader>
        <main className="flex-grow">{children}</main>
        <ConditionalFooter><Footer /></ConditionalFooter>
      </body>
    </html>
  );
}
