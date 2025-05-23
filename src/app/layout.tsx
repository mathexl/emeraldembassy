import type { Metadata } from "next";
import { Ibarra_Real_Nova } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "./registry";

const ibarraRealNova = Ibarra_Real_Nova({
  variable: "--font-ibarra-real-nova",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Emerald Embassy",
  description: "The Emerald Embassy",
  openGraph: {
    title: "The Emerald Embassy",
    description: "The Emerald Embassy",
    url: "https://www.emeraldembassy.com",
    images: [
      {
        url: "https://www.emeraldembassy.com/ogimage.png",
        alt: "The Emerald Embassy",
      },
    ],
    type: "website",
    siteName: "The Emerald Embassy",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ibarraRealNova.variable}>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}

