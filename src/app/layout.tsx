import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsAppButton from "@/components/layout/FloatingWhatsAppButton";
import { HOME_DESCRIPTION, HOME_TITLE, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: HOME_TITLE,
    template: "%s",
  },
  description: HOME_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
};

import { ConditionalFloatingAction, ConditionalHeader, ConditionalFooter } from "@/components/layout/ConditionalLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased min-h-screen flex flex-col">
        <ConditionalHeader><Navbar /></ConditionalHeader>
        <main className="flex-grow">{children}</main>
        <ConditionalFooter><Footer /></ConditionalFooter>
        <ConditionalFloatingAction><FloatingWhatsAppButton /></ConditionalFloatingAction>
      </body>
    </html>
  );
}
