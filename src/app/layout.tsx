import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "@objectifthunes/three-book — API reference & live demo",
  description:
    "Live, source-paired reference for @objectifthunes/three-book — a realistic 3D page-turning book for Three.js. Every export, documented with working examples.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
