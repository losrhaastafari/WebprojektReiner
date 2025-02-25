"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { OfferDetailTable } from "@/components/offerdetailtable";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext"; // ✅ Import des UserContext für Rollen

interface Offer {
  id: string;
  description: string;
  price: number;
  customer_id: string;
  status: string;
}

interface Comment {
  id: string;
  text: string;
  created_at: string;
}

interface FileInfo {
  fileId: string;
  fileName: string;
  fileUrl: string;
}

export default function OfferDetailPage() {
  const { offerId } = useParams(); 
  const router = useRouter();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { role } = useUser(); // ✅ Aktuelle Benutzerrolle aus dem Kontext

  useEffect(() => {
    fetchOffer();
    fetchUploadedFiles();
    fetchComments();
  }, [offerId, role]); // 👈 Jetzt wird auch auf Änderungen der Rolle reagiert
  

  const fetchOffer = async () => {
    const response = await fetch(`http://localhost:8080/Offer/${offerId}`);
    if (response.ok) {
      setOffer(await response.json());
    } else {
      console.error("Angebot nicht gefunden");
    }
  };

  const fetchUploadedFiles = async () => {
    const response = await fetch(`http://localhost:8080/Offer/${offerId}/files`);
    if (response.ok) {
      setUploadedFiles(await response.json());
    }
  };

  const fetchComments = async () => {
    const response = await fetch(`http://localhost:8080/Offer/${offerId}/comments`);
    if (response.ok) {
      setComments(await response.json());
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/angebote/bearbeiten?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("http://localhost:8080/Offer/deleteOffer", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "username": role, // ✅ Benutzerrolle im Header senden
          "password": role.toLowerCase(), // Simulierte Authentifizierung
        },
        body: JSON.stringify({ id }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Löschen");
      }
      
      toast.success("✅ Angebot erfolgreich gelöscht!");
      router.push("/"); // Zurück zur Übersicht
    } catch (error: any) {
      console.error("Fehler beim Löschen:", error);
      toast.error(`❌ Fehler: ${error.message}`);
    }
    return;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Angebotsdetails</h1>
      {offer ? <OfferDetailTable offer={offer} onDelete={() => handleDelete(offer.id)} onEdit={() => handleEdit(offer.id)} /> : <p>Lädt...</p>}
      <section className="bg-gray-100 shadow-md rounded-2xl p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Dokumente hochladen</h2>
        <div className="border-2 border-dashed rounded-xl p-6 text-center bg-white cursor-pointer">
          <input type="file" ref={fileInputRef} className="hidden" multiple />
          <p>📂 Ziehe Dateien hierher oder klicke zum Hochladen</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} className="mt-3">➕ Datei hinzufügen</Button>
      </section>
    </div>
  );
}