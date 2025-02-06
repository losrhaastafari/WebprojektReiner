import { useState } from "react";
import axios from "axios";

interface Customer {
  id?: number;
  name: string;
  adress: string;
  phone: string;
  email: string;
}

interface CustomerFormProps {
  onCustomerCreated: (customer: Customer) => void;
}

export default function CustomerForm({ onCustomerCreated }: CustomerFormProps) {
  const [name, setName] = useState<string>("");
  const [adress, setAdress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const customer: Customer = { name, adress, phone, email };

      const response = await axios.post("http://localhost:8080/Customer/createCustomer", customer);
      alert("Kunde erfolgreich erstellt!");
      onCustomerCreated(response.data);
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
        value={adress}
        onChange={(e) => setAdress(e.target.value)}
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