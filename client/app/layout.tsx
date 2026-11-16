import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shefin • Full-Stack Engineer",
  description: "Personal portfolio of Shefin - Full-Stack Engineer specializing in React, Next.js, Express, and MongoDB.",
  icons: {
    icon: "/shefin.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-white text-neutral-900 selection:bg-amber-200 selection:text-neutral-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
