import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conan — Tokyo Travel Guide",
  description: "AI-powered travel guide for curated Tokyo spots",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
