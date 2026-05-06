import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conan — Tokyo Travel Guide",
  description: "AI-powered travel guide for curated Tokyo spots",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
