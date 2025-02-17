import DataTable from "@/components/DataTable";

interface Customer {
  id: string;
  name: string;
  address: string;
  email: string;
}

interface CustomerTableProps {
  customers: Customer[];
}

export default function CustomerTable({ customers }: CustomerTableProps) {
  const columns = [
    { key: "id", label: "Kunden ID" },
    { key: "name", label: "Name" },
    { key: "address", label: "Adresse" },
    { key: "email", label: "E-Mail" },
  ];

  return <DataTable data={customers} columns={columns} title="Übersicht über alle Kunden" />;
}

