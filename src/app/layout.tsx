import type { Metadata } from "next";
import { Ibarra_Real_Nova } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "./registry";

const ibarraRealNova = Ibarra_Real_Nova({
  variable: "--font-ibarra-real-nova",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SECRET HOME CAFE",
  description: "SECRET HOME CAFE",
  openGraph: {
    title: "SECRET HOME CAFE",
    description: "SECRET HOME CAFE",
    url: "https://www.emeraldembassy.com",
    images: [
      {
        url: "https://www.emeraldembassy.com/ogimage.png",
        alt: "SECRET HOME CAFE",
      },
    ],
    type: "website",
    siteName: "SECRET HOME CAFE",
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

