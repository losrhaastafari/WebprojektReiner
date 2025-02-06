import { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container">
      <h3>Liste der Kunden</h3>
      <div className="row">
        {customers.map((customer) => (
          <div key={customer.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{customer.name}</h5>
                <p className="card-text">
                  <strong>Adresse:</strong> {customer.adress}<br />
                  <strong>Telefon:</strong> {customer.phone}<br />
                  <strong>E-Mail:</strong> {customer.email}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
