import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div className="container text-center border border-dark rounded mt-5">
      <div className="row">
        <h1>Customer List</h1>
      </div>
      <div className="row">
        <div className="col">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>
                <i className="fa-solid fa-user"></i>
                </th>
                <th>Name</th>
                <th>Adresse</th>
                <th>Telefon-Nr.</th>
                <th>E-Mail</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.adress}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}