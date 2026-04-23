import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Xuexi Hanzi",
  description: "Chinese learning platform with words and sentences.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-white">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 bg-white dark:bg-slate-950">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}