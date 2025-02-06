import { useEffect, useState } from "react";
import axios from "axios";

interface Customer {
  id: number;
  name: string;
  adress: string;
  phone: string;
  email: string;
}

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    axios.get("http://localhost:8080/Customer/getCustomers")
      .then((response) => setCustomers(response.data))
      .catch((error) => console.error("Fehler beim Laden der Kunden:", error));
  }, []);

  return (
    <div>
      <h3>Liste der Kunden</h3>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            <strong>{customer.name}</strong><br />
            Adresse: {customer.adress}<br />
            Telefon: {customer.phone}<br />
            E-Mail: {customer.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
