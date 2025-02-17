"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowDown, ArrowUp, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Offer {
  id: string;
  description: string;
  price: number;
  customer_id: string;
  status: string;
}

export function OfferTable({ offers, onDelete }: { offers: Offer[]; onDelete: (id: string) => void }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  
  // 🔄 Dynamische Höhenberechnung
  const rowHeight = 57; // Durchschnittliche Zeilenhöhe in Pixel
  const headerHeight = 57; // Header-Höhe
  const maxHeight = 600; // Maximale Höhe vor Scroll
  const tableHeight = Math.min(
    headerHeight + (offers.length * rowHeight),
    maxHeight
  );

  const table = useReactTable({
    data: offers,
    columns: columns(onDelete),
    state: { sorting, columnFilters },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center py-2">
        <Input
          placeholder="Filter nach Beschreibung..."
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("description")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border relative">
        {/* 📏 Dynamische Scroll-Area */}
        <ScrollArea 
          className={`w-full ${offers.length > 5 ? 'h-[500px]' : 'h-auto'}`}
          style={{ height: offers.length > 5 ? maxHeight : 'auto' }}
        >
          <Table className="relative">
            <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-4 py-3 font-medium text-left"
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

        {/* 🖐️ Empty State */}
        {offers.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">
            Keine Angebote in dieser Kategorie
          </div>
        )}
      </div>
    </div>
  );
}

const columns = (onDelete: (id: string) => void): ColumnDef<Offer>[] => [
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
    accessorKey: "actions",
    header: "Aktion",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
            ID kopieren
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500" onClick={() => onDelete(row.original.id)}>
            <Trash className="mr-2 h-4 w-4" />
            Löschen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];