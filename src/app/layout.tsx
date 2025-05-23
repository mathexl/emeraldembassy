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
  description: "The Emerald Embassy"
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

