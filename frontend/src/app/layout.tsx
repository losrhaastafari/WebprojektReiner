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
      <head>
        <link rel="icon" type="image/svg+xml" href="/Prismarine-Solutions-Icon.svg" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-blue-50`}> 
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
                      <div className="bg-white shadow-lg rounded-xl p-10 text-center">
                        <h2 className="text-6xl font-extrabold text-black-600">Prismarine Solutions</h2>
                        <p className="text-gray-500 text-lg mt-4">
                          Ihre digitale Zukunft beginnt hier – Innovation, Effizienz und maßgeschneiderte Lösungen.
                        </p>
                      </div>
                      <div className="mt-10">
                        <DashboardStats />
                      </div>
                      <div className="mt-10">
                        <OfferOverview />
                      </div>
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
