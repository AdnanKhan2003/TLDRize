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
  title: "TLDRize",
  description: "AI Summary for Articles",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "TLDRize",
    description: "Summarize articles using AI and save them to your library.",
    url: "https://tldrize.vercel.app", // Placeholder URL, update if you have a real one
    siteName: "TLDRize",
    images: [
      {
        url: "/icon.png", // Must be an absolute URL in production, but relative works if metadataBase is set
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TLDRize",
    description: "Summarize articles using AI and save them to your library.",
    images: ["/icon.png"], // Must be an absolute URL in production
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
