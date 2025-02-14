"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sidebar, SidebarProvider, SidebarContent } from "@/components/ui/sidebar";

type Offer = {
  id: number;
  description: string;
  price: number;
  status: "Draft" | "Active" | "On Ice";
  customer_id: number;
};

export function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/Offer/getOffers")
      .then((res) => res.json())
      .then((data) => {
        setOffers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const draftOffers = offers.filter((offer) => offer.status === "Draft");
  const activeOffers = offers.filter((offer) => offer.status === "Active");
  const onIceOffers = offers.filter((offer) => offer.status === "On Ice");

  const columns: ColumnDef<Offer>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "customer_id",
      header: "Kunden-ID",
      cell: ({ row }) => <div className="text-gray-900">{row.getValue("customer_id")}</div>,
    },
    {
      accessorKey: "description",
      header: "Beschreibung",
      cell: ({ row }) => <div className="text-gray-900">{row.getValue("description")}</div>,
    },
    {
      accessorKey: "price",
      header: "Preis (€)",
      cell: ({ row }) => <div className="text-gray-900">{row.getValue("price").toFixed(2)} €</div>,
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
        {/* Sidebar mit fester Breite */}
        <div className="w-72 h-full bg-white shadow-lg flex-shrink-0">
          <SidebarContent className="p-6 space-y-6">
            <h2 className="text-lg font-bold text-gray-700">Navigation</h2>
            <Button className="w-full flex justify-start gap-2 text-white bg-blue-500 hover:bg-blue-600">
              🏠 Übersicht
            </Button>
            <Button className="w-full flex justify-start gap-2 text-white bg-blue-500 hover:bg-blue-600">
              👥 Kunden
            </Button>
            <Button className="w-full flex justify-start gap-2 text-white bg-blue-500 hover:bg-blue-600">
              📜 Angebote
            </Button>
          </SidebarContent>
        </div>

        {/* Hauptinhalt mit dynamischer Breite */}
        <div className="flex-1 h-full overflow-y-auto p-8">
          <div className="mx-auto w-full max-w-none">
            <h1 className="text-4xl font-extrabold text-blue-600 mb-8">Angebote Übersicht</h1>

            {loading ? (
              <p className="text-gray-900">Lade Angebote...</p>
            ) : (
              <>
                <div className="space-y-8 w-full">
                  <div className="w-full">
                    <h2 className="text-2xl font-semibold text-blue-500 mb-4">📄 Draft Angebote</h2>
                    <TableComponent columns={columns} data={draftOffers} />
                  </div>

                  <div className="w-full">
                    <h2 className="text-2xl font-semibold text-green-500 mb-4">✅ Active Angebote</h2>
                    <TableComponent columns={columns} data={activeOffers} />
                  </div>
                </div>

                <Accordion type="single" collapsible className="mt-8 w-full">
                  <AccordionItem value="onIce" className="w-full">
                    <AccordionTrigger className="bg-gray-200 p-3 rounded-lg text-gray-900 w-full">
                      ❄️ On Ice Angebote ({onIceOffers.length})
                    </AccordionTrigger>
                    <AccordionContent className="p-6 border border-gray-300 rounded-lg w-full">
                      <TableComponent columns={columns} data={onIceOffers} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

function TableComponent({ columns, data }: { columns: ColumnDef<Offer>[]; data: Offer[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full rounded-md border border-gray-300 shadow-sm">
      <Table className="w-full">
        <TableHeader className="bg-gray-200 text-gray-900">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead 
                  key={header.id}
                  className="text-gray-900 text-lg font-medium p-4"
                  style={{ width: `${100/columns.length}%` }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell 
                    key={cell.id} 
                    className="text-gray-900 p-4"
                    style={{ width: `${100/columns.length}%` }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-gray-500 p-6">
                Keine Angebote gefunden.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}