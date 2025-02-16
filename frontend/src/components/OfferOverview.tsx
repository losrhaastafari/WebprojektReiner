"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// 🟢 **1. Definiere das Offer-Interface**
interface Offer {
  id: string;
  description: string;
  price: number;
  customer_id: string;
  status: string;
}

// 🟢 **2. API-Daten holen & Fehlerbehandlung**
export default function OfferOverview() {
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("http://localhost:8080/Offer/getOffers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOffers(data);
        } else {
          setOffers([]);
          setError("Ungültige API-Antwort");
        }
      })
      .catch((err) => {
        console.error("API Fehler:", err);
        setError("Fehler beim Laden der Daten");
        setOffers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const deleteOffer = async (id: string) => {
    const response = await fetch("http://localhost:8080/Offer/deleteOffer", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setOffers((prevOffers) => prevOffers.filter((offer) => offer.id !== id));
    } else {
      console.error("Fehler beim Löschen des Angebots");
    }
  };

  if (loading) return <p className="text-center p-4">Lade Daten...</p>;
  if (error) return <p className="text-center p-4 text-red-500">{error}</p>;

  const draftOffers = offers.filter((offer) => offer.status === "Draft");
  const activeOffers = offers.filter((offer) => offer.status === "Active");
  const onIceOffers = offers.filter((offer) => offer.status === "On Ice");

  return (
    <div className="w-full space-y-6">
      {/* Draft-Angebote */}
      {draftOffers.length > 0 && (
        <>
          <h2 className="text-xl font-bold">Draft Offers</h2>
          <OfferTable offers={draftOffers} onDelete={deleteOffer} />
        </>
      )}

      {/* Active-Angebote */}
      {activeOffers.length > 0 && (
        <>
          <h2 className="text-xl font-bold">Active Offers</h2>
          <OfferTable offers={activeOffers} onDelete={deleteOffer} />
        </>
      )}

      {/* On Ice Angebote im zugeklappten Akkordeon */}
      {onIceOffers.length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="onIce">
            <AccordionTrigger className="text-lg font-bold">On Ice Offers</AccordionTrigger>
            <AccordionContent>
              <OfferTable offers={onIceOffers} onDelete={deleteOffer} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}

// 🟢 **3. Spalten-Definition für die Tabelle**
const columns = (onDelete: (id: string) => void) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
  { accessorKey: "id", header: "Angebot ID" },
  { accessorKey: "description", header: "Beschreibung" },
  { accessorKey: "price", header: "Preis (€)", cell: ({ row }) => <div>{row.getValue("price")} €</div> },
  { accessorKey: "customer_id", header: "Kunden ID" },
  {
    accessorKey: "actions",
    header: "Aktion", // 🟢 **Spaltenname über den drei Punkten**
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
            Angebot ID kopieren
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Bearbeiten
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(row.original.id)} className="text-red-500">
            <Trash className="mr-2 h-4 w-4" />
            Löschen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

// 🟢 **4. OfferTable-Komponente**
function OfferTable({ offers, onDelete }: { offers: Offer[]; onDelete: (id: string) => void }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: offers ?? [],
    columns: columns(onDelete),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Beschreibung..."
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("description")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  Keine Angebote verfügbar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );  
}