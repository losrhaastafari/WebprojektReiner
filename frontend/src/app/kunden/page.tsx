"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DataTable } from "@/components/DataTable"; 
import { columns, Customer } from "@/app/kunden/columns"; // Spaltenimport

export default function KundenPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/Customer/getCustomers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fehler beim Abrufen der Kunden");
        }
        return response.json();
      })
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Lade Kunden...</p>;
  if (error) return <p className="p-6 text-red-500">Fehler: {error}</p>;

  return (
    <div className="p-6 w-full"> {/* Stellt sicher, dass der gesamte Container die volle Breite nutzt */}
      <h1 className="text-2xl font-bold mb-4">Kundenliste</h1>

      {/* Button zum Anlegen eines neuen Kunden */}
      <Link href="/kunden/anlegen">
        <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          + Neuer Kunde
        </button>
      </Link>

      {/* Kunden-Tabelle mit voller Breite */}
      <div className="w-full overflow-x-auto"> {/* Falls die Tabelle zu breit wird */}
        <DataTable columns={columns} data={customers} />
      </div>
    </div>
  );
}
