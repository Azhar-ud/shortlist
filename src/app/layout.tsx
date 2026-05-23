import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["wdth"],
});

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Shortlist — Calibrated AI screening",
  description:
    "Paste a job description, drop in resumes, and let the model rank fit with cited reasoning. Built for recruiters who need honest signal in twelve seconds, not slop.",
  metadataBase: new URL("https://shortlist-opal.vercel.app"),
  openGraph: {
    title: "Shortlist — Calibrated AI screening",
    description:
      "Honest, cited resume screening with a calibrated rubric. No signup.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${geist.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="relative min-h-full bg-bg text-ink">{children}</body>
    </html>
  );
}
