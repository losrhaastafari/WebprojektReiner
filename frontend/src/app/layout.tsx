import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Lobster } from "next/font/google"; 
import "./globals.css";
import "@/styles/table.css"; 
import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import OfferOverview from "@/components/OfferOverview";
import DashboardStats from "@/components/ui/DashboardStats";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const lobster = Lobster({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Offers Overview",
  description: "View and manage your offers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider>
          <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex-1 p-6 w-full min-w-0 overflow-x-auto">
              <div className={`text-center text-4xl ${lobster.variable} my-6`}>
                Willkommen auf der Angebotsseite!
              </div>
              <DashboardStats />
              {children}
              <div className="mt-4"></div>
              <OfferOverview /> {/* Sicherstellen, dass dies korrekt eingebunden ist */}
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}