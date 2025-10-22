import type React from "react";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from '@clerk/nextjs';
import { AuthProvider } from "@/contexts/auth-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

import "@/app/globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
});

const fontHeading = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "HalalChain | Blockchain-Powered Halal Logistics Platform",
  description:
    "Transparent, secure, and compliant Halal supply chain management with blockchain technology for certification tracking, shipment monitoring, and audit compliance.",
  keywords: [
    "halal logistics",
    "blockchain",
    "supply chain",
    "certification tracking",
    "halal compliance",
    "Oracle Cloud",
  ],
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-white font-sans antialiased font-light",
            fontSans.variable,
            fontHeading.variable,
          )}
        >
          <ThemeProvider
            defaultTheme="dark"
            storageKey="halal-logistics-theme"
          >
            <AuthProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
