"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/DataTable";

interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
}

export default function KundenPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/Customer/getCustomers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch(() => setError("Fehler beim Laden der Kunden"))
      .finally(() => setLoading(false));
  }, []);

  const deleteCustomer = async (id: string) => {
    await fetch("http://localhost:8080/Customer/deleteCustomer", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  const columns = [
    { accessorKey: "id", header: "Kunden ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "E-Mail" },
    { accessorKey: "address", header: "Adresse" },
  ];

  if (loading) return <p className="text-center p-4">Lade Kunden...</p>;
  if (error) return <p className="text-center p-4 text-red-500">{error}</p>;

  return <DataTable data={customers} columns={columns} title="Kundenliste" onDelete={deleteCustomer} />;
}
