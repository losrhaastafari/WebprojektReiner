"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Pencil, Trash, Info, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useRouter } from "next/navigation";

interface Offer {
  id: string;
  description: string;
  price: number;
  customer_id: string;
  status: string;
}

export function OfferTable({ 
  offers, 
  onDelete, 
  onEdit 
}: { 
  offers: Offer[]; 
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const router = useRouter(); // ✅ Hier wird useRouter initialisiert

  const maxHeight = 600;

  const table = useReactTable({
    data: offers,
    columns: columns(onDelete, onEdit, router), // ✅ router wird als Argument übergeben
    state: { sorting, columnFilters },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div className="w-full space-y-4">
      {/* 🔍 Nur nach Beschreibung filtern */}
      <div className="flex items-center py-2">
        <Input
          placeholder="Filter nach Beschreibung..."
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("description")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border relative">
        <ScrollArea 
          className={`w-full ${offers.length > 5 ? "h-[500px]" : "h-auto"}`}
          style={{ height: offers.length > 5 ? maxHeight : "auto" }}
        >
          <Table className="relative">
            <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-4 py-3 font-medium text-left cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-x-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <>
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUp className="w-4 h-4" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDown className="w-4 h-4" />
                            ) : (
                              <ArrowUpDown className="w-4 h-4 opacity-50" />
                            )}
                          </>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns(onDelete, onEdit, router).length} className="h-24 text-center">
                    Keine Angebote gefunden.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        {offers.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">
            Keine Angebote in dieser Kategorie
          </div>
        )}
      </div>
    </div>
  );
}

const columns = (
  onDelete: (id: string) => void,
  onEdit: (id: string) => void,
  router: ReturnType<typeof useRouter> // ✅ Router als Argument übergeben
): ColumnDef<Offer>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Angebot ID",
    enableSorting: true,
  },
  {
    accessorKey: "description",
    header: "Beschreibung",
    enableColumnFilter: true,
  },
  {
    accessorKey: "price",
    header: "Preis (€)",
    enableSorting: true,
    cell: ({ row }) => <div>{row.getValue("price")} €</div>,
  },
  {
    accessorKey: "customer_id",
    header: "Kunden ID",
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false, // ❌ Status kann NICHT sortiert werden
  },
  {
    accessorKey: "actions",
    header: "Aktionen",
    enableColumnFilter: false,
    enableSorting: false,
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

        {/* ℹ️ Details */}
        <Button 
          variant="ghost" 
          className="p-2 text-gray-500 hover:bg-gray-100" 
          onClick={() => router.push(`/angebote/detailansicht/${row.original.id}`)} // ✅ Korrekte Navigation
        >
          <Info className="h-5 w-5" />
        </Button>
      </div>
    ),
  },
];
