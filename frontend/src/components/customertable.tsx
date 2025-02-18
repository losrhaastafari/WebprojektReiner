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

import { ArrowUpDown, ArrowDown, ArrowUp, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

// 🟢 **Customer Interface basierend auf customerDB**
interface Customer {
  id: number;
  name: string;
  adress: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export function CustomerTable({ customers, onDelete }: { customers: Customer[]; onDelete: (id: number) => void }) {
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: customers,
    columns: columns(onDelete),
    state: { sorting, globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    globalFilterFn: (row, columnId, value) => {
      return row.getValue(columnId).toString().toLowerCase().includes(value.toLowerCase());
    },
  });

  return (
    <div className="w-full space-y-4 bg-slate-100 p-4 rounded-md shadow-sm">
      <h2 className="text-2xl font-bold">Kundenliste</h2>

      {/* 🔍 Filter-Funktion */}
      <div className="flex items-center py-2">
        <Input
          placeholder="Filter nach Name..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* 📋 Tabellenstruktur */}
      <div className="rounded-md border relative">
        <ScrollArea className={customers.length > 5 ? "h-[500px]" : "h-auto"}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} onClick={header.column.getToggleSortingHandler()}>
                      <div className="flex items-center gap-x-2 cursor-pointer">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          header.column.getIsSorted() === "asc" ? <ArrowUp className="w-4 h-4" /> :
                          header.column.getIsSorted() === "desc" ? <ArrowDown className="w-4 h-4" /> :
                          <ArrowUpDown className="w-4 h-4 opacity-50" />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns(onDelete).length} className="h-24 text-center">
                    Keine Kunden gefunden.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}

// 🟢 **Spalten-Definition für die CustomerTable**
const columns = (onDelete: (id: number) => void): ColumnDef<Customer>[] => [
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
  { accessorKey: "id", header: "Kunden ID", enableSorting: true },
  { accessorKey: "name", header: "Name", enableSorting: true },
  { accessorKey: "adress", header: "Adresse", enableSorting: true },
  { accessorKey: "phone", header: "Telefon", enableSorting: true },
  { accessorKey: "email", header: "E-Mail", enableSorting: true },
  { accessorKey: "created_at", header: "Erstellt am", enableSorting: true },
  { accessorKey: "updated_at", header: "Zuletzt geändert", enableSorting: true },
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id.toString())}>
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
