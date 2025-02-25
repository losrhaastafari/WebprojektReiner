"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Offer {
  id: string;
  description: string;
  price: number;
  customer_id: string;
  status: string;
}

export function OfferDetailTable({
  offer,
  onDelete,
  onEdit
}: {
  offer: Offer;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  const table = useReactTable({
    data: [offer], // Nur ein einzelnes Angebot wird angezeigt
    columns: columns(onDelete, onEdit),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      <div className="rounded-md border relative">
        <ScrollArea className="w-full h-auto">
          <Table className="relative">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Beschreibung</TableHead>
                <TableHead>Preis</TableHead>
                <TableHead>Kunde</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{offer.id}</TableCell>
                <TableCell>{offer.description}</TableCell>
                <TableCell>{offer.price}</TableCell>
                <TableCell>{offer.customer_id}</TableCell>
                <TableCell>{offer.status}</TableCell>
                <TableCell>
                  <Button variant="ghost" className="p-2 text-blue-500" onClick={() => onEdit(offer.id)}>
                    <Pencil className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" className="p-2 text-red-500" onClick={() => onDelete(offer.id)}>
                    <Trash className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}

function columns(onDelete: (id: string) => void, onEdit: (id: string) => void): ColumnDef<Offer>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "description",
      header: "Beschreibung",
    },
    {
      accessorKey: "price",
      header: "Preis",
    },
    {
      accessorKey: "customer_id",
      header: "Kunde",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      header: "Aktionen",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="ghost" className="p-2 text-blue-500" onClick={() => onEdit(row.original.id)}>
            <Pencil className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="p-2 text-red-500" onClick={() => onDelete(row.original.id)}>
            <Trash className="h-5 w-5" />
          </Button>
        </div>
      ),
    },
  ];
}
