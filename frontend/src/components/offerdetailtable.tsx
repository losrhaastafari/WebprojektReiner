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
            <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-4 py-3 font-medium text-left">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}

const columns = (
  onDelete: (id: string) => void,
  onEdit: (id: string) => void
): ColumnDef<Offer>[] => [
  {
    accessorKey: "id",
    header: "Angebot ID",
  },
  {
    accessorKey: "description",
    header: "Beschreibung",
  },
  {
    accessorKey: "price",
    header: "Preis (€)",
    cell: ({ row }) => <div>{row.getValue("price")} €</div>,
  },
  {
    accessorKey: "customer_id",
    header: "Kunden ID",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "actions",
    header: "Aktionen",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-3">
        {/* ✏️ Bearbeiten */}
        <Button 
          variant="ghost" 
          className="p-2 text-blue-500 hover:bg-blue-100" 
          onClick={() => onEdit(row.original.id)}
        >
          <Pencil className="h-5 w-5" />
        </Button>

        {/* 🗑️ Löschen */}
        <Button 
          variant="ghost" 
          className="p-2 text-red-500 hover:bg-red-100" 
          onClick={() => onDelete(row.original.id)}
        >
          <Trash className="h-5 w-5" />
        </Button>
      </div>
    ),
  },
];
