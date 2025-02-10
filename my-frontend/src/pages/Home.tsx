import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DoughnutChart from '../components/DoughnutChart';
import HighchartsChart from '../components/HighchartsChart';
import ErrorBoundary from '../components/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

interface Offer {
  id: number;
  description: string;
  price: number;
  status: string;
  customer_id: number;
}

export default function Home() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    axios
      .get('http://localhost:8080/Offer/getOffers')
      .then((response) => setOffers(response.data))
      .catch((error) => console.error('Fehler beim Laden der Angebote:', error));
  }, []);

  const toggleSection = (status: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const groupedOffers = offers.reduce((acc: { [key: string]: Offer[] }, offer) => {
    acc[offer.status] = acc[offer.status] || [];
    acc[offer.status].push(offer);
    return acc;
  }, {});

  return (
    <ErrorBoundary>
      <div className="container mt-4">
        <div className="text-center mb-4">
          <h1 className="text-primary">Willkommen im Angebotssystem</h1>
          <p className="text-muted">Verwalten Sie Ihre Angebote effizient und behalten Sie den Überblick.</p>
        </div>

        <div className="text-center mb-4">
          <Link to="/customers" className="btn btn-outline-primary btn-lg">
            👥 Alle Kunden anzeigen
          </Link>
        </div>

        {Object.keys(groupedOffers).map((status) => (
          <div key={status} className="mb-4">
            <button
              className="btn btn-primary w-100 text-start"
              onClick={() => toggleSection(status)}
            >
              {openSections[status] ? '▼' : '►'} {status}
            </button>
            {openSections[status] && (
              <div className="card p-3 border-primary shadow-sm">
                <ul className="list-group">
                  {groupedOffers[status].map((offer) => (
                    <li
                      key={offer.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h5 className="mb-1">{offer.description}</h5>
                        <small className="text-muted">Preis: {offer.price}€</small>
                      </div>
                      <span className="badge bg-info text-dark">Kunde {offer.customer_id}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        <div className="text-center my-5">
          <DoughnutChart />
          <HighchartsChart />
        </div>
      </div>
    </ErrorBoundary>
  );
}
