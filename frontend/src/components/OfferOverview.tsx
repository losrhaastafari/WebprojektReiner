"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext"; // ✅ Import des UserContext für Rollen
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { OfferTable } from "./offertable";
import { OfferDetailTable } from "./offerdetailtable"; // ✅ Import der OfferDetailTable-Komponente
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// 🟢 Interface-Definition
interface Offer {
  id: string;
  description: string;
  price: number;
  customer_id: string;
  status: string;
}

export default function OfferOverview() {
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = React.useState<Offer | null>(null); // ✅ Zustand für das ausgewählte Angebot
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const { role, username, password } = useUser(); // ✅ Aktuelle Benutzerrolle aus dem Kontext
  const router = useRouter();

  // 🟢 API-Abfrage
  React.useEffect(() => {
    fetch("http://localhost:8080/Offer/getOffers")
      .then((res) => {
        if (!res.ok) {
          toast.error("Keine Angebote vorhanden") // ✅ Nur echte Fehler werden geworfen
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOffers(data); 
          setError(null); // ✅ Kein Fehler, wenn Daten vorhanden sind
        } else {
          setOffers([]); // ✅ Leeres Array setzen
        }
      })
      .catch((err) => {
        console.error("Fehler:", err);
        setError("Serverfehler: " + err.message); // ✅ Nur echte Serverfehler anzeigen
      })
      .finally(() => setLoading(false));
  }, []);
  
  

  // 🟢 Löschfunktion mit Berechtigungsprüfung
  const deleteOffer = async (id: string) => {
    try {
      const response = await fetch("http://localhost:8080/Offer/deleteOffer", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "username": username || "", // ✅ Benutzerrolle im Header senden
          "password": password || "", // Simulierte Authentifizierung
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Löschen");
      }

      // ✅ Erfolgreich gelöscht: Erfolgsmeldung anzeigen
      toast.success("✅ Angebot erfolgreich gelöscht!");
      setOffers((prev) => prev.filter((o) => o.id !== id));
    } catch (error: any) {
      console.error("Fehler beim Löschen:", error);
      toast.error(`❌ Fehler: ${error.message}`);
    }
  };

  // 🟢 Lade- und Fehlerzustände
  if (loading) return <div className="text-center p-4">Lade Angebote...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  // 🟢 Kategorisierung der Angebote
  const statusGroups = {
    draft: offers.filter((o) => o.status === "Draft"),
    active: offers.filter((o) => o.status === "Active"),
    onIce: offers.filter((o) => o.status === "On Ice"),
  };

  return (
    <div className="w-full space-y-8 p-4">
      {/* 🟢 Blauer Button zum Anlegen eines neuen Angebots */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Angebotsübersicht</h1>
        {role !== "User" && (
          <Link href="/anlegen">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              + Neues Angebot
            </Button>
          </Link>
        )}
      </div>

      {/* 🟢 Draft-Angebote */}
      {statusGroups.draft.length > 0 && (
        <section className="bg-gray-200 p-4 rounded-md shadow-md border">
          <h2 className="text-2xl font-bold mb-4">Draft Angebote</h2>
          <OfferTable
            offers={statusGroups.draft}
            onDelete={deleteOffer}
            onRowClick={(id) => setSelectedOffer(offers.find((o) => o.id === id) || null)} // ✅ Angebot auswählen
          />
        </section>
      )}

      {/* 🟢 Aktive Angebote */}
      {statusGroups.active.length > 0 && (
        <section className="bg-green-100 p-4 rounded-md shadow-md border border-green-200">
          <h2 className="text-2xl font-bold mb-4">Aktive Angebote</h2>
          <OfferTable
            offers={statusGroups.active}
            onDelete={deleteOffer}
            onRowClick={(id) => setSelectedOffer(offers.find((o) => o.id === id) || null)} // ✅ Angebot auswählen
          />
        </section>
      )}

      {/* 🟢 On Ice Angebote */}
      {statusGroups.onIce.length > 0 && (
        <Accordion type="single" collapsible className="bg-blue-100 p-4 rounded-md shadow-md border border-gray-200">
          <AccordionItem value="onIce">
            <AccordionTrigger className="text-2xl font-bold">
              On Ice Angebote
            </AccordionTrigger>
            <AccordionContent>
              <OfferTable
                offers={statusGroups.onIce}
                onDelete={deleteOffer}
                onRowClick={(id) => setSelectedOffer(offers.find((o) => o.id === id) || null)} // ✅ Angebot auswählen
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* 🟢 Detailansicht des ausgewählten Angebots */}
      {selectedOffer && (
        <OfferDetailTable
          offer={selectedOffer}
          onDelete={deleteOffer}
          onEdit={(id) => router.push(`/angebote/bearbeiten?id=${id}`)}
        />
      )}
    </div>
  );
}
