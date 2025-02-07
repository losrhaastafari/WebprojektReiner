import React, { useState } from 'react';
import axios from 'axios';

interface Customer {
  id?: number;
  name: string;
  adress: string;
  phone: string;
  email: string;
}

interface CustomerFormProps {
  onCustomerCreated: () => void;
}

export default function CustomerForm({ onCustomerCreated }: CustomerFormProps) {
  const [name, setName] = useState<string>("");
  const [adress, setAdress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const customer: Customer = { name, adress, phone, email };

    try {
      const response = await axios.post("http://localhost:8080/Customer/createCustomer", customer);
      if (response.status === 201) {
        alert(response.data.message || "Kunde erfolgreich erstellt!");
        onCustomerCreated(); // Callback-Funktion aufrufen
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("Fehler beim Erstellen des Kunden: " + error.message);
      }
    }
  }; 

  return (
    <div className="container text-center mt-5">
      <form onSubmit={handleSubmit}>
        <h3>Neuen Kunden erstellen</h3>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Adresse"
              value={adress}
              onChange={(e) => setAdress(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Telefon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <input
              type="email"
              className="form-control"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Erstellen</button>
      </form>
    </div>
  )}; 