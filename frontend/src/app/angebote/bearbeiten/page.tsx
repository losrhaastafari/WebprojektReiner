"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext"; 

export default function EditOfferPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offerId = searchParams.get("id");
  const { username, password } = useUser(); // ✅ Aktuelle Benutzerrolle aus dem Kontext
  
  const [offer, setOffer] = useState({
    id: "",
    description: "",
    price: "",
    customer_id: "",
    status: "",
  });

  useEffect(() => {
    if (!offerId) return;
    
    fetch(`http://localhost:8080/Offer/${offerId}`)
      .then((res) => res.json())
      .then((data) => setOffer(data))
      .catch((err) => console.error("Fehler beim Laden des Angebots:", err));
  }, [offerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOffer((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!offer.id) {
      toast.error("Fehlende Angebots-ID");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/Offer/updateOffer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "username": username || "", // ✅ Benutzerrolle im Header senden
          "password": password || "", // Simulierte Authentifizierung
        },
        body: JSON.stringify(offer),
      });

      if (!response.ok) throw new Error("Fehler beim Aktualisieren des Angebots");

      toast.success("✅ Angebot erfolgreich aktualisiert!");
      router.push("/");
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Angebot bearbeiten</h1>
      <div className="space-y-4">
        <div>
          <Label>Beschreibung</Label>
          <Input name="description" value={offer.description} onChange={handleInputChange} />
        </div>
        <div>
          <Label>Preis</Label>
          <Input name="price" type="number" value={offer.price} onChange={handleInputChange} />
        </div>
        <div>
          <Label>Kunden-ID</Label>
          <Input name="customer_id" value={offer.customer_id} onChange={handleInputChange} />
        </div>
        <div>
          <Label>Status</Label>
          <select 
            name="status" 
            value={offer.status} 
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
          >
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="On Ice">On Ice</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>
      </div>
      <Button onClick={handleUpdate} className="mt-4 bg-blue-500 text-white hover:bg-blue-600">
        💾 Änderungen speichern
      </Button>
    </div>
  );
}
