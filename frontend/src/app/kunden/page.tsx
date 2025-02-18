"use client";

import { useEffect, useState } from "react";
import {CustomerTable} from "@/components/customertable"; // Stelle sicher, dass dieser Import korrekt ist

interface Customer {
  id: number;
  name: string;
  adress: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export default function KundenPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/Customer/getCustomers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch(() => setError("Fehler beim Laden der Kunden"));
  }, []);

  const deleteCustomer = async (id: number) => {
    try {
      const response = await fetch("http://localhost:8080/Customer/deleteCustomer", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Fehler beim Löschen");

      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Fehler beim Löschen des Kunden:", error);
    }
  };

  if (error) return <p className="text-center p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kundenverwaltung</h1>
      <CustomerTable customers={customers} onDelete={deleteCustomer} />
    </div>
  );
}
