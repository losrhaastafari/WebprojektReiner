"use client";

import { ColumnDef } from "@tanstack/react-table";

// Kunden-Datenstruktur
export type Customer = {
  id: number;
  name: string;
  adress: string;
  phone: string;
  email: string;
};

// Definiere die Spalten für die Tabelle
export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "adress",
    header: "Adresse",
  },
  {
    accessorKey: "phone",
    header: "Telefon",
  },
  {
    accessorKey: "email",
    header: "E-Mail",
  },
];
