"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

//Berechtigungskonzept
import { useUser } from "@/context/UserContext";

export default function CreateOfferPage() {
  const { role } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: "",
    price: "",
    customer_id: "",
    status: "Active", // Standardwert
  });
  const [loading, setLoading] = useState(false);

  // 📝 Funktion zum Aktualisieren des Formulars
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📩 Funktion zum Absenden des Formulars
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/Offer/createOffer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "username": role,
          "password": role.toLowerCase(),
        },
        body: JSON.stringify({
          description: formData.description,
          price: Number(formData.price),
          customer_id: Number(formData.customer_id),
          status: formData.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Fehler beim Erstellen des Angebots");

      toast.success("✅ Angebot erfolgreich erstellt!");
      router.push("/"); // Leitet nach dem Speichern zur Startseite weiter
    } catch (error: any) {
      toast.error(`❌ Fehler: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">📝 Neues Angebot erstellen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 📝 Beschreibung */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Beschreibung</label>
              <Input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Gib eine Beschreibung ein..."
                required
              />
            </div>

            {/* 💰 Preis */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Preis (€)</label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Preis eingeben..."
                required
              />
            </div>

            {/* 👥 Kunden-ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Kunden ID</label>
              <Input
                type="number"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                placeholder="Kunden-ID eingeben..."
                required
              />
            </div>

            {/* 🔄 Status Auswahl */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Ice">On Ice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 🔘 Senden-Button */}
            <Button type="submit" className="w-full bg-blue-600 text-white" disabled={loading}>
              {loading ? "Wird erstellt..." : "Angebot erstellen"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
