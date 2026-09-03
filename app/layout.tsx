import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Nyx After Dark — Get Your Tickets",
  description:
    "An exclusive night of music, art, and immersive experiences. Get your tickets now.",
  openGraph: {
    title: "Nyx After Dark — Get Your Tickets",
    description:
      "An exclusive night of music, art, and immersive experiences.",
    type: "website",
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Nyx After Dark — 27 Oct 2026' }],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-black text-white min-h-screen`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
