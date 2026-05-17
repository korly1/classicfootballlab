import type { Metadata } from "next";
import { Barlow, Bebas_Neue } from "next/font/google";

import { RecoveryHashRedirect } from "@/components/auth/recovery-hash-redirect";
import { QueryProvider } from "@/components/providers/query-provider";

import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const barlow = Barlow({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Classic Football Lab | Brazilian Lab of Football — Santa Clarita, CA",
  description:
    "Youth football development in Santa Clarita — Classic Football Lab.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${barlow.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cfl-navy font-[family-name:var(--font-barlow)] text-cfl-text-body">
        <QueryProvider>
          <RecoveryHashRedirect />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
