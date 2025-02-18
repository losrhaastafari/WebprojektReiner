"use client";

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono, Lobster } from "next/font/google";
import "./globals.css";
import "@/styles/table.css"; 
import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import OfferOverview from "@/components/OfferOverview";
import DashboardStats from "@/components/DashboardStats";
import Footer from "@/components/Footer"; // ✅ Footer Import
import { Toaster } from "sonner"; // ✅ Toaster Import
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const lobster = Lobster({ weight: "400", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <UserProvider>
          <SidebarProvider>
            <div className="flex flex-1">
              {/* Sidebar */}
              <AppSidebar />

              {/* Hauptinhalt & Footer */}
              <div className="flex flex-col flex-1 w-full min-w-0 overflow-x-auto">
                <div className="flex-1 p-6">
                  {/* ✅ Toaster global einbinden */}
                  <Toaster position="top-right" />

                  {/* 🏠 Nur auf der Startseite sichtbar */}
                  {isHomePage && (
                    <>
                      <div className={`text-center text-4xl ${lobster.variable} my-6`}>
                        Willkommen auf der Angebotsseite!
                      </div>
                      <DashboardStats />
                      <OfferOverview />
                    </>
                  )}

                  {/* 🔀 Dynamische Seiteninhalte (`/kunden`, `/angebote` etc.) */}
                  {children}
                </div>

                {/* ✅ Sticky Footer */}
                <Footer />
              </div>
            </div>
          </SidebarProvider>
        </UserProvider>
      </body>
    </html>
  );
}
