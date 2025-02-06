import { useState } from "react";
import axios from "axios";

interface Offer {
  id?: number;
  description: string;
  price: number;
  customer_id: number;
  status: string;
}

interface OfferFormProps {
  onOfferCreated: (offer: Offer) => void;
}

export default function OfferForm({ onOfferCreated }: OfferFormProps) {
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");
  const [status, setStatus] = useState<string>("Draft");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const offer: Offer = {
      description,
      price: parseFloat(price),
      customer_id: parseInt(customerId),
      status,
    };

    try {
      const response = await axios.post("http://localhost:8080/Offer/createOffer", offer);
      alert("Angebot erfolgreich erstellt!");
      onOfferCreated(response.data);
    } catch (error) {
      alert("Fehler beim Erstellen des Angebots.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Neues Angebot erstellen</h3>
      <input
        type="text"
        placeholder="Beschreibung"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Preis"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Kunden-ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Draft">Draft</option>
        <option value="Active">Active</option>
        <option value="On Ice">On Ice</option>
      </select>
      <button type="submit">Erstellen</button>
    </form>
  );
}