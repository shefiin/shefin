import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shefin",
  description: "Personal portfolio of Shefin - Software Engineer specializing in full-stack systems, scalable backend architectures, and distributed web applications.",
  icons: {
    icon: [
      { url: "/shefin.png" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/shefin.png",
    apple: "/shefin.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-white text-neutral-900 selection:bg-amber-200 selection:text-neutral-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
