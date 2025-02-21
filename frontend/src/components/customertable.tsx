"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ArrowUpDown, ArrowDown, ArrowUp, Trash, Pencil, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useUser } from "../context/UserContext"; // Importiere den Benutzerkontext
import { useRouter } from "next/navigation";

// 🟢 **Customer Interface**
interface Customer {
  id: number;
  name: string;
  adress: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export function CustomerTable({ onEdit, onViewDetails }: { 
  onEdit: (id: number) => void;
  onViewDetails: (id: number) => void;
}) {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const { role } = useUser(); // ✅ Aktuelle Benutzerrolle aus dem Kontext
  const router = useRouter();

  // 🟢 API-Abfrage
  React.useEffect(() => {
    fetch("http://localhost:8080/Customer/getCustomers")
      .then((res) => {
        if (!res.ok) throw new Error("Serverfehler");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCustomers(data);
        } else {
          throw new Error("Ungültiges Datenformat");
        }
      })
      .catch((err) => {
        console.error("Fehler:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🟢 Löschfunktion mit Berechtigungsprüfung
  const deleteCustomer = async (id: number) => {
    try {
      const response = await fetch("http://localhost:8080/Customer/deleteCustomer", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "username": role,
          "password": role.toLowerCase(),
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Löschen");
      }

      toast.success("✅ Kunde erfolgreich gelöscht!");
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (error: any) {
      console.error("Fehler beim Löschen:", error);
      toast.error(`❌ Fehler: ${error.message}`);
    }
  };

  if (loading) return <div className="text-center p-4">Lade Kunden...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="w-full space-y-4 bg-slate-100 p-4 rounded-md shadow-sm">
      <h2 className="text-2xl font-bold">Kundenliste</h2>

      <div className="rounded-md border relative">
        <ScrollArea className={customers.length > 5 ? "h-[500px]" : "h-auto"}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Aktion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length ? (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.adress}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      <Button variant="ghost" className="p-2 text-blue-500" onClick={() => onEdit(customer.id)}>
                        <Pencil className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" className="p-2 text-red-500" onClick={() => deleteCustomer(customer.id)}>
                        <Trash className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" className="p-2 text-gray-500" onClick={() => onViewDetails(customer.id)}>
                        <Info className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">Keine Kunden gefunden.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}