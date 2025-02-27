"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// ShadCN UI Select-Imports
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Berechtigungskonzept
import { useUser } from "@/context/UserContext";

export default function Page() {
  const { role, username, password } = useUser();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Angebotsdaten
  const [offerData, setOfferData] = useState({
    description: "",
    price: "",
    customer_id: "",
    status: "Draft",
  });

  // Kundendaten
  const [customerData, setCustomerData] = useState({
    name: "",
    adress: "",
    phone: "",
    email: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<Array<{ id: number; name: string }>>([]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:8080/Customer/getCustomers");
      if (!response.ok) throw new Error("Fehler beim Laden der Kunden");
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Ungültiges Kundenformat");
      setCustomers(data.map(({ id, name }) => ({ id, name }))); // Nur relevante Felder speichern
    } catch (error) {
      toast.error("❌ Fehler beim Laden der Kunden: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Funktion für Datei-Auswahl über Button
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Funktion für Drag & Drop Upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/plain": [".txt"], // Akzeptiert .txt-Dateien
      "application/pdf": [".pdf"], // PDFs erlauben
      "image/*": [".jpg", ".png", ".jpeg"], // Bilder erlauben
    },
    onDrop: (acceptedFiles) => {
      setSelectedFiles((prevFiles) => {
        const newFiles = acceptedFiles.filter(
          (file) => !prevFiles.some((existingFile) => existingFile.name === file.name)
        );
        return [...prevFiles, ...newFiles];
      });
    },
  });
  

  // Dateien über den Datei-Explorer hinzufügen
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles([...selectedFiles, ...Array.from(event.target.files)]);
    }
  };

  // Angebotsformular absenden
  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/Offer/createOffer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "username": username || "", // ✅ Benutzerrolle im Header senden
          "password": password || "", // Simulierte Authentifizierung
        },
        body: JSON.stringify(offerData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Fehler beim Erstellen des Angebots");

      toast.success("✅ Angebot erfolgreich erstellt!");

      const offerId = data.offer.id;

      if (selectedFiles.length > 0) {
        await uploadFiles(offerId);
      }

      router.push(`/angebote/detailansicht/${offerId}`);
    } catch (error: any) {
      toast.error(`❌ ${error.message}`);
    }
  };

  // Dateien hochladen
  const uploadFiles = async (offerId: string) => {
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("file", file));

    try {
      const response = await fetch(`http://localhost:8080/Offer/${offerId}/files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "username": username || "", // ✅ Benutzerrolle im Header senden
          "password": password || "", // Simulierte Authentifizierung
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Fehler beim Hochladen der Dateien");

      toast.success("✅ Dateien erfolgreich hochgeladen!");
      setSelectedFiles([]);
    } catch (error: any) {
      toast.error(`❌ ${error.message}`);
    }
  };

  // Kundenformular absenden
  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/Customer/createCustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "username": username || "", // ✅ Benutzerrolle im Header senden
          "password": password || "", // Simulierte Authentifizierung
        },
        body: JSON.stringify(customerData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Fehler beim Erstellen des Kunden");
      toast.success("✅ Kunde erfolgreich erstellt!");
      fetchCustomers();
    } catch (error: any) {
      toast.error(`❌ ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-12">
      <h1 className="text-2xl font-bold">Neues Angebot und Kunde anlegen</h1>

      {/* Angebotsformular */}
      <section className="bg-gray-100 shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Angebot anlegen</h2>
        <form onSubmit={handleOfferSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Beschreibung</Label>
            <Input
              id="description"
              type="text"
              placeholder="Beschreibung des Angebots"
              value={offerData.description}
              onChange={(e) =>
                setOfferData({ ...offerData, description: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="price">Preis</Label>
            <Input
              id="price"
              type="number"
              placeholder="Preis"
              value={offerData.price}
              onChange={(e) =>
                setOfferData({ ...offerData, price: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="customer_id">Kunde</Label>
            {isLoading ? (
              <p>Lädt Kunden...</p>
            ) : (
              <Select
                value={offerData.customer_id}
                onValueChange={(value) => setOfferData({ ...offerData, customer_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kunden auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {customers.length > 0 ? (
                    customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.name} (ID: {customer.id})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="">Keine Kunden verfügbar</SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={offerData.status}
              onValueChange={(value) => setOfferData({ ...offerData, status: value })}
            >
              <SelectTrigger id="status">
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
          
          {/* Datei-Upload mit Drag & Drop und Button */}
          <div className="bg-gray-400 p-4 rounded-xl">
            <Label>Dokumente hochladen</Label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              } rounded-xl p-6 text-center bg-white hover:bg-gray-50 cursor-pointer`}
            >
              <input {...getInputProps()} ref={fileInputRef} />
              {isDragActive ? (
                <p className="text-blue-500">📂 Lass die Dateien hier fallen...</p>
              ) : (
                <p className="text-gray-500">📂 Ziehe Dateien hierher oder klicke zum Hochladen</p>
              )}
            </div>

            {/* Zeigt die hochgeladenen Dateien an */}
            {selectedFiles.length > 0 && (
              <ul className="mt-3 text-sm text-gray-600">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="p-2 bg-gray-200 rounded-lg flex items-center justify-between">
                    📄 {file.name}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                    >
                      ❌
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {/* + Button für Datei-Auswahl */}
            <Button type="button" onClick={handleFileButtonClick} className="mt-3">
              ➕ Datei hinzufügen
            </Button>
          </div>

          <Button type="submit">Angebot erstellen</Button>
        </form>
      </section>

      {/* Kundenformular */}
      <section className="bg-gray-100 shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Kunde anlegen</h2>
        <form onSubmit={handleCustomerSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Name des Kunden"
              value={customerData.name}
              onChange={(e) =>
                setCustomerData({ ...customerData, name: e.target.value })
              }
            />
          </div>

          {/* Adresse */}
          <div>
            <Label htmlFor="adress">Adresse</Label>
            <Input
              id="adress"
              type="text"
              placeholder="Adresse des Kunden"
              value={customerData.adress}
              onChange={(e) =>
                setCustomerData({ ...customerData, adress: e.target.value })
              }
            />
          </div>

          {/* Telefon-Nr. */}
          <div>
            <Label htmlFor="phone">Telefon-Nr.</Label>
            <Input
              id="phone"
              type="text"
              placeholder="Telefonnummer des Kunden"
              value={customerData.phone}
              onChange={(e) =>
                setCustomerData({ ...customerData, phone: e.target.value })
              }
            />
          </div>

          {/* E-Mail */}
          <div>
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="E-Mail-Adresse des Kunden"
              value={customerData.email}
              onChange={(e) =>
                setCustomerData({ ...customerData, email: e.target.value })
              }
            />
          </div>

          <Button type="submit">Kunde erstellen</Button>
        </form>
      </section>
    </div>
  );
}
