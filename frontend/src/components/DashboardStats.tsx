"use client";

import React, { useEffect, useState } from "react";
import { Folder, Users, MessageSquare, FileText } from "lucide-react";

interface Stats {
  customers: number;
  offers: number;
  comments: number;
  files: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    customers: 0,
    offers: 0,
    comments: 0,
    files: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        // 🟢 Kundenanzahl abrufen
        const customersRes = await fetch("http://localhost:8080/Customer/getCustomers");
        const customersData = await customersRes.json();
        const customersCount = Array.isArray(customersData) ? customersData.length : 0;

        // 🟢 Angebotsanzahl abrufen
        const offersRes = await fetch("http://localhost:8080/Offer/getOffers");
        const offersData = await offersRes.json();
        const offersCount = Array.isArray(offersData) ? offersData.length : 0;

        // 🟢 Kommentare & Dateien zählen (Iterationen nötig)
        let totalComments = 0;
        let totalFiles = 0;

        if (Array.isArray(offersData)) {
          for (const offer of offersData) {
            // Kommentare abrufen
            const commentsRes = await fetch(`http://localhost:8080/Offer/${offer.id}/comments`);
            const commentsData = await commentsRes.json();
            if (Array.isArray(commentsData)) {
              totalComments += commentsData.length;
            }

            // Dateien abrufen
            const filesRes = await fetch(`http://localhost:8080/Offer/${offer.id}/files`);
            const filesData = await filesRes.json();
            if (Array.isArray(filesData)) {
              totalFiles += filesData.length;
            }
          }
        }

        setStats({
          customers: customersCount,
          offers: offersCount,
          comments: totalComments,
          files: totalFiles,
        });
      } catch (error) {
        console.error("Fehler beim Laden der Statistiken:", error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4 p-4 bg-gray-100 rounded-lg">
      <StatBox icon={<Folder size={24} />} label="Anzahl Angebote" value={stats.offers} />
      <StatBox icon={<Users size={24} />} label="Anzahl Kunden" value={stats.customers} />
      <StatBox icon={<MessageSquare size={24} />} label="Anzahl Kommentare" value={stats.comments} />
      <StatBox icon={<FileText size={24} />} label="Anzahl Dokumente" value={stats.files} />
    </div>
  );
}

// 🟢 **Kleine UI-Komponente für ein Statistikkästchen**
function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-md space-x-4">
      <div className="p-2 bg-gray-200 rounded-full">{icon}</div>
      <div>
        <p className="text-lg font-semibold">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
}