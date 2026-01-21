import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { BlockedUserProvider } from "@/context/BlockedUserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Library",
  description: "A clean and simple electronic library.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            <BlockedUserProvider>
              <Navbar />
              <main className="container" style={{ paddingBottom: "2rem" }}>
                {children}
              </main>
            </BlockedUserProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
