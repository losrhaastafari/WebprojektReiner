"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/DataTable";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface Offer {
  id: string;
  description: string;
  price: number;
  customer_id: string;
  status: string; // 🟢 Status-Feld hinzugefügt
}

export default function AngebotePage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/Offer/getOffers")
      .then((res) => res.json())
      .then((data) => setOffers(data))
      .catch(() => setError("Fehler beim Laden der Angebote"))
      .finally(() => setLoading(false));
  }, []);

  const deleteOffer = async (id: string) => {
    await fetch("http://localhost:8080/Offer/deleteOffer", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  const columns = [
    { accessorKey: "id", header: "Angebot ID" },
    { accessorKey: "description", header: "Beschreibung" },
    { accessorKey: "price", header: "Preis (€)", cell: ({ row }) => <div>{row.getValue("price")} €</div> },
    { accessorKey: "customer_id", header: "Kunden ID" },
  ];

  if (loading) return <p className="text-center p-4">Lade Angebote...</p>;
  if (error) return <p className="text-center p-4 text-red-500">{error}</p>;

  // 🟢 Filtere Angebote nach Status
  const draftOffers = offers.filter((offer) => offer.status === "Draft");
  const activeOffers = offers.filter((offer) => offer.status === "Active");
  const onIceOffers = offers.filter((offer) => offer.status === "On Ice");

  return (
    <div className="w-full space-y-6">
      {/* 🟢 Draft-Angebote */}
      {draftOffers.length > 0 && (
        <>
          <h2 className="text-xl font-bold">Draft Offers</h2>
          <DataTable data={draftOffers} columns={columns} title="Draft Angebote" onDelete={deleteOffer} />
        </>
      )}

      {/* 🟢 Active-Angebote */}
      {activeOffers.length > 0 && (
        <>
          <h2 className="text-xl font-bold">Active Offers</h2>
          <DataTable data={activeOffers} columns={columns} title="Aktive Angebote" onDelete={deleteOffer} />
        </>
      )}

      {/* 🟢 On Ice Angebote im zugeklappten Akkordeon */}
      {onIceOffers.length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="onIce">
            <AccordionTrigger className="text-lg font-bold">On Ice Offers</AccordionTrigger>
            <AccordionContent>
              <DataTable data={onIceOffers} columns={columns} title="On Ice Angebote" onDelete={deleteOffer} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
