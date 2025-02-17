"use client";

import * as React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { OfferTable } from "./offertable"; // ✅ Korrekter Import der separaten Tabelle

// 🟢 Interface-Definition
interface Offer {
  id: string;
  description: string;
  price: number;
  customer_id: string;
  status: string;
}

// 🟢 Hauptkomponente
export default function OfferOverview() {
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // 🟢 API-Abfrage
  React.useEffect(() => {
    fetch("http://localhost:8080/Offer/getOffers")
      .then((res) => {
        if (!res.ok) throw new Error("Serverfehler");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setOffers(data);
        } else {
          throw new Error("Ungültiges Datenformat");
        }
      })
      .catch((err) => {
        console.error("Fehler:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🟢 Löschfunktion
  const deleteOffer = async (id: string) => {
    try {
      const response = await fetch("http://localhost:8080/Offer/deleteOffer", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Löschen fehlgeschlagen");
      setOffers((prev) => prev.filter((offer) => offer.id !== id));
    } catch (err) {
      console.error("Fehler beim Löschen:", err);
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
      {/* Draft-Angebote */}
      {statusGroups.draft.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Draft Angebote</h2>
          <OfferTable offers={statusGroups.draft} onDelete={deleteOffer} />
        </section>
      )}

      {/* Aktive Angebote */}
      {statusGroups.active.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Aktive Angebote</h2>
          <OfferTable offers={statusGroups.active} onDelete={deleteOffer} />
        </section>
      )}

      {/* On Ice Angebote */}
      {statusGroups.onIce.length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="onIce">
            <AccordionTrigger className="text-2xl font-bold">
              On Ice Angebote
            </AccordionTrigger>
            <AccordionContent>
              <OfferTable offers={statusGroups.onIce} onDelete={deleteOffer} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}