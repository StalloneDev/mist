import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MIST – Market Intelligence & Sales Tracking",
  description: "Plateforme d'intelligence terrain pour commerciaux carburants et lubrifiants",
};

import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.variable}>
          <Toaster position="top-right" toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }} />
          <div className="app-shell">
            <Sidebar />
            <main className="app-content">
              {children}
            </main>
          </div>
      </body>
    </html>
  );
}
