import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsAppButton from "@/components/layout/FloatingWhatsAppButton";

export const metadata: Metadata = {
  title: "PeriyotLab | Laboratuvar ve Kimyasal Çözümler",
  description: "Kimyasal ürünler, teknik dokümanlar ve laboratuvar tedarik çözümleri.",
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
