import "./globals.css";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ESTORA Property Group — Spaces that move you.",
  description:
    "Exceptional properties. Remarkable possibilities. Find your next place to live, invest, and grow with ESTORA Property Group.",
  openGraph: {
    title: "ESTORA Property Group — Spaces that move you.",
    description:
      "Exceptional properties. Remarkable possibilities. Find your next place to live, invest, and grow.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ESTORA Property Group — Spaces that move you.",
    description:
      "Exceptional properties. Remarkable possibilities. Find your next place to live, invest, and grow.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
