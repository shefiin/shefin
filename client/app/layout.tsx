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
  title: "Shefin • Software Engineer",
  description: "Personal portfolio of Shefin - Software Engineer specializing in full-stack systems, scalable backend architectures, and distributed web applications.",
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
