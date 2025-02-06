import { useState } from "react";
import axios from "axios";

interface Customer {
  id?: number;
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface CustomerFormProps {
  onCustomerCreated: (customer: Customer) => void;
}

export default function CustomerForm({ onCustomerCreated }: CustomerFormProps) {
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const customer: Customer = { name, address, phone, email };

    try {
      const response = await axios.post("http://localhost:8080/Customer/createCustomer", customer);
      alert("Kunde erfolgreich erstellt!");
      onCustomerCreated(response.data);
    } catch (error) {
      alert("Fehler beim Erstellen des Kunden.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Neuen Kunden erstellen</h3>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Adresse"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Telefon"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Erstellen</button>
    </form>
  );
}