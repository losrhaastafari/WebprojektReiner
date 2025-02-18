"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-900 p-4 mt-auto shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          © {new Date().getFullYear()} Dein Unternehmen. Alle Rechte vorbehalten.
        </p>

        <Separator className="hidden md:block w-1/4" />

        <div className="flex space-x-4">
          <Button variant="ghost" asChild>
            <a href="/impressum">Impressum</a>
          </Button>
          <Button variant="ghost" asChild>
            <a href="/datenschutz">Datenschutz</a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
