"use client";

import * as React from "react";
import { useRouter } from "next/navigation"; // Verwende next/navigation anstelle von next/router
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OfferDetailTable } from "@/components/offerdetailtable";
import { useUser } from "@/context/UserContext"; // ✅ Import des UserContext für Rollen
import { useDropzone } from "react-dropzone";
import { useRef, useState } from "react";


interface Comment {
  id: string;
  text: string;
  created_at: string;
}

interface Offer {
  id: string;
  description: string;
  price: number;
  customer_id: string;
  status: string;
}

export default function OfferDetailPage() {
  const [offer, setOffer] = React.useState<Offer | null>(null);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [newComment, setNewComment] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const { offerId } = useParams(); // Extrahiere die offer_id aus den URL-Parametern
  const numericOfferId = Number(offerId); //Sorgt dafür, dass die offerId als Zahl interpretiert wird, da die Datenbank einen Integer erwartet und userParams() die OfferId als String zurückgibt.
  const { username, password } = useUser(); // ✅ Aktuelle Benutzerrolle aus dem Kontext
  // 🟢 API-Abfrage für Angebotsdetails
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  
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

  // Dateien hochladen
  const handleFileUpload = async (numericOfferId: string) => {
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("file", file));

    try {
      const response = await fetch(`http://localhost:8080/Offer/${numericOfferId}/files`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Fehler beim Hochladen der Dateien");

      toast.success("✅ Dateien erfolgreich hochgeladen!");
      setSelectedFiles([]);
    } catch (error: any) {
      toast.error(`❌ ${error.message}`);
    }
  };
  React.useEffect(() => {
    if (!offerId) return;

    fetch(`http://localhost:8080/Offer/${numericOfferId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Serverfehler");
        return res.json();
      })
      .then((data) => {
        setOffer(data);
      })
      .catch((err) => {
        console.error("Fehler:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [offerId]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/Offer/deleteOffer`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "username": username || "",
          "password": password || "",
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
  };

  const handleEdit = (id: string) => {
    router.push(`/angebote/bearbeiten?id=${id}`);
  };
  
  // 🟢 API-Abfrage für Kommentare
  const fetchComments = React.useCallback(() => {
    if (!offerId) return;

    fetch(`http://localhost:8080/Offer/${numericOfferId}/comments`)
      .then((res) => {
        if (!res.ok) throw new Error("Serverfehler");
        return res.json();
      })
      .then((data) => {
        setComments(data);
      })
      .catch((err) => {
        console.error("Fehler:", err);
        setError(err.message);
      });
  }, [offerId]);

  // 🟢 Funktion zum Hinzufügen eines Kommentars
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("❌ Kommentar darf nicht leer sein!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/Offer/${numericOfferId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "username": username || "", // ✅ Benutzerrolle im Header senden
          "password": password || "", // Simulierte Authentifizierung
        },
        body: JSON.stringify({ comment: newComment }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Löschen");
      }

      setNewComment("");
      fetchComments();
      toast.success("✅ Kommentar hinzugefügt!");
    } catch (error: any) {
      console.error("Fehler beim Hinzufügen des Kommentars:", error);
      toast.error(`❌ Fehler: ${error.message}`);
    }
  };


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Angebotsdetails</h1>
      {offer ? (
          <OfferDetailTable 
            offer={offer} 
            onDelete={() => handleDelete(offer.id)}
            onEdit={() => handleEdit(offer.id)}
          />
        ) : <p>Lädt...</p>}
      <section className="bg-gray-100 shadow-md rounded-2xl p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Kommentare</h2>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id} className="bg-white p-3 my-2 rounded-md shadow-sm">
              {comment.comment}
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Label htmlFor="comment">Neuen Kommentar hinzufügen</Label>
          <Input 
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Schreibe einen Kommentar..."
            className="mt-2"
          />
          <Button onClick={handleAddComment} className="mt-3">➕ Kommentar hinzufügen</Button>
        </div>
      </section>

      <section className="bg-gray-100 shadow-md rounded-2xl p-6">
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

    {/* Neuer Button für das Hochladen */}
    <Button type="button" onClick={() => handleFileUpload(numericOfferId)} className="mt-3 bg-blue-500 text-white hover:bg-blue-600">
      ⬆️ Dokument hochladen
    </Button>
  </div>
</section>

      </div>
  );
}