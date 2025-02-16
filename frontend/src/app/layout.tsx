import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/table.css"; // Neue Zeile
import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import OfferOverview from "@/components/OfferOverview";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

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
              {children}
              <OfferOverview />
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}