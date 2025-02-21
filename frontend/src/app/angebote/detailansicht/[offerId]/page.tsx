"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { OfferDetailTable } from "@/components/offerdetailtable";

interface Offer {
  id: string;
  description: string;
  price: number;
  customer_id: string;
  status: string;
}

export default function OfferDetailPage() {
  const { offerId } = useParams(); 
  const [offer, setOffer] = useState<Offer | null>(null);

  useEffect(() => {
    fetchOffer();
  }, [offerId]);

  const fetchOffer = async () => {
    const response = await fetch(`http://localhost:8080/Offer/${offerId}`);
    if (response.ok) {
      setOffer(await response.json());
    } else {
      console.error("Angebot nicht gefunden");
    }
  };

  const handleEdit = (id: string) => {
    console.log(`Bearbeiten von Angebot ${id}`);
    // Hier kannst du die Bearbeitungslogik hinzufügen
  };

  const handleDelete = (id: string) => {
    console.log(`Löschen von Angebot ${id}`);
    // Hier kannst du die Löschlogik hinzufügen
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Angebotsdetails</h1>
      {offer ? (
        <OfferDetailTable offer={offer} onDelete={handleDelete} onEdit={handleEdit} />
      ) : (
        <p>Lädt...</p>
      )}
    </div>
  );
}
