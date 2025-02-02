import React, { useState, useEffect } from 'react';

const Customers = () => {
  // Hier werden die Kunden-Daten gespeichert
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hole die Daten von der API, wenn die Komponente geladen wird
  useEffect(() => {
    fetch('http://localhost:8080/Customer/getCustomers')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Umwandeln der Antwort in JSON
      })
      .then((data) => {
        setCustomers(data); // Kunden-Daten setzen
        setLoading(false); // Ladevorgang beenden
      })
      .catch((error) => {
        setError(error.message); // Fehler setzen
        setLoading(false); // Ladevorgang beenden
      });
  }, []); // Der leere Array bedeutet, dass useEffect nur einmal ausgeführt wird, wenn die Komponente geladen wird

  // Zeige den Lade-Status, Fehler oder die Kunden an
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Kunden aus der Datenbank</h1>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            {customer.name} {/* Hier kannst du weitere Eigenschaften der Kunden anzeigen */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Customers;