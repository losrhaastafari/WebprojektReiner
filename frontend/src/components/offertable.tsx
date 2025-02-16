import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Offer {
  id: string;
  description: string;
  price: number;
  customer_id: string;
}

interface OfferTableProps {
  offers: Offer[];
}

export default function OfferTable({ offers }: OfferTableProps) {
  return (
      <div className="flex-1 p-6 w-full min-w-0 overflow-x-auto">
        <Table className="w-full border border-gray-300">
          <TableCaption className="text-lg font-semibold">
            Übersicht über alle Angebote
          </TableCaption>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="min-w-[120px]">Angebot ID</TableHead>
              <TableHead className="min-w-[300px]">Beschreibung</TableHead>
              <TableHead className="min-w-[100px]">Preis</TableHead>
              <TableHead className="min-w-[120px]">Kunden ID</TableHead>
              <TableHead className="min-w-[120px]">Aktion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.length > 0
              ? offers.map((offer) => (
                  <TableRow key={offer.id} className="border-t">
                    <TableCell className="px-6 py-3">{offer.id}</TableCell>
                    <TableCell className="px-6 py-3">{offer.description}</TableCell>
                    <TableCell className="px-6 py-3">{offer.price} €</TableCell>
                    <TableCell className="px-6 py-3 text-right">{offer.customer_id}</TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </div>
  );
}