import Navbar from "@/components/nav";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Footer from "@/components/footer";

const ogImage =
  "https://res.cloudinary.com/dk5mfu099/image/upload/v1791883199/___1_-removebg-preview_emp4cg.png";

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
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "ESTORA Property Group",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ESTORA Property Group — Spaces that move you.",
    description:
      "Exceptional properties. Remarkable possibilities. Find your next place to live, invest, and grow.",
    images: [ogImage],
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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
