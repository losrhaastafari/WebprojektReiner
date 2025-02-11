import React, { useEffect, useState } from "react";
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
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    axios
      .get("http://localhost:8080/Customer/getCustomers")
      .then((response) => setCustomers(response.data))
      .catch((error) => console.error("Fehler beim Laden der Kunden:", error));
  };

  const handleDelete = (id: number) => {
    axios
      .delete("http://localhost:8080/Customer/deleteCustomer", { data: { id } })
      .then(() => {
        alert("Kunde gelöscht");
        fetchCustomers();
      })
      .catch((error) => console.error("Fehler beim Löschen des Kunden:", error));
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer({ ...customer });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCustomer) return;

    axios
      .put("http://localhost:8080/Customer/updateCustomer", editingCustomer)
      .then((response) => {
        alert(response.data.message || "Kunde erfolgreich aktualisiert!");
        setEditingCustomer(null);
        fetchCustomers(); // Kundenliste neu laden
      })
      .catch((error) => console.error("Fehler beim Aktualisieren des Kunden:", error));
};

  return (
    <div className="container mt-5">
      <h2>Kundenliste</h2>
      <ul className="list-group">
        {customers.map((customer) => (
          <li key={customer.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{customer.name}</h5>
              <small>Adresse: {customer.adress} | Telefon: {customer.phone} | Email: {customer.email}</small>
            </div>
            <div>
              <button className="btn btn-warning btn-sm mx-1" onClick={() => handleEdit(customer)}>
                Bearbeiten
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(customer.id)}>
                Löschen
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingCustomer && (
        <div className="mt-4 p-3 border rounded">
          <h4>Kunde bearbeiten</h4>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              value={editingCustomer.name}
              onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
              className="form-control mb-2"
              required
            />
            <input
              type="text"
              value={editingCustomer.adress}
              onChange={(e) => setEditingCustomer({ ...editingCustomer, adress: e.target.value })}
              className="form-control mb-2"
              required
            />
            <input
              type="text"
              value={editingCustomer.phone}
              onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
              className="form-control mb-2"
              required
            />
            <input
              type="email"
              value={editingCustomer.email}
              onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
              className="form-control mb-2"
              required
            />
            <button type="submit" className="btn btn-primary">Speichern</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditingCustomer(null)}>Abbrechen</button>
          </form>
        </div>
      )}
    </div>
  );
}