import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEXUS SAINT | CODE: POSTHUMAN",
  description: "Industrial, Cyber, Posthuman Apparel.",
};

import Navbar from "@/components/Navbar";
import BackgroundEffects from "@/components/BackgroundEffects";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";
import EdgeDecorations from "@/components/EdgeDecorations";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <BackgroundEffects />
        <EdgeDecorations />
        <Navbar />
        <CartSidebar />
        <main className="relative z-10 pt-20 min-h-screen">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
