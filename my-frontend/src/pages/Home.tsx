import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DoughnutChart from '../components/DoughnutChart';
import HighchartsChart from '../components/HighchartsChart';
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
  const [customerCount, setCustomerCount] = useState<number>(0);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Angebote laden
    axios
      .get('http://localhost:8080/Offer/getOffers')
      .then((response) => {
        const allOffers = response.data;
        setOffers(allOffers);

        // Filtere nur Angebote mit Status "Active"
        const activeOffers = allOffers.filter((offer: Offer) => offer.status === 'Active');

        // Gesamtkommentare initialisieren
        let commentCount = 0;

        // Kommentare für aktive Angebote abrufen
        const commentRequests = activeOffers.map((offer: Offer) =>
          axios
            .get(`http://localhost:8080/${offer.id}/comments`)
            .then((commentResponse) => {
              commentCount += commentResponse.data.length; // Anzahl der Kommentare addieren
            })
            .catch((error) => {
              console.error(`Fehler beim Laden der Kommentare für Angebot ${offer.id}:`, error);
            })
        );

        // Nach Abschluss aller Anfragen Gesamtkommentare setzen
        Promise.all(commentRequests).then(() => setTotalComments(commentCount));
      })
      .catch((error) => console.error('Fehler beim Laden der Angebote:', error));

    // Kundenanzahl laden
    axios
      .get('http://localhost:8080/Customer/getCustomers')
      .then((response) => setCustomerCount(response.data.length))
      .catch((error) => console.error('Fehler beim Laden der Kundenanzahl:', error));
  }, []);

  const toggleSection = (status: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const groupedOffers = offers.reduce(
    (acc: { Draft: Offer[]; Active: Offer[]; OnIce: Offer[] }, offer) => {
      if (offer.status === 'Draft') acc.Draft.push(offer);
      if (offer.status === 'Active') acc.Active.push(offer);
      if (offer.status === 'On Ice') acc.OnIce.push(offer);
      return acc;
    },
    { Draft: [], Active: [], OnIce: [] }
  );

  return (
    <div className="container mt-4">
      {/* Dashboard */}
      <div className="row text-center mb-4">
        <div className="col-md-3">
          <div className="card border-primary">
            <div className="card-body">
              <h5 className="card-title">Gesamtangebote</h5>
              <p className="card-text">{offers.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-success">
            <div className="card-body">
              <h5 className="card-title">Kommentare</h5>
              <p className="card-text">{totalComments}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-info">
            <div className="card-body">
              <h5 className="card-title">Kunden</h5>
              <p className="card-text">{customerCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-warning">
            <div className="card-body">
              <h5 className="card-title">Statusübersicht</h5>
              <p className="card-text">
                Draft: {groupedOffers.Draft.length} <br />
                Active: {groupedOffers.Active.length} <br />
                On Ice: {groupedOffers.OnIce.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Angebotelisten */}
      <div className="text-center mb-4">
        <h1 className="text-primary">Willkommen im Angebotssystem</h1>
        <p className="text-muted">Verwalten Sie Ihre Angebote effizient und behalten Sie den Überblick.</p>
      </div>

      <div className="text-center mb-4">
        <Link to="/customers" className="btn btn-outline-primary btn-lg">
          👥 Alle Kunden anzeigen
        </Link>
      </div>

      {/* Draft Angebote */}
      <div className="mb-4">
        <h4>Draft Angebote</h4>
        <ul className="list-group">
          {groupedOffers.Draft.map((offer) => (
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

      {/* Active Angebote */}
      <div className="mb-4">
        <h4>Active Angebote</h4>
        <ul className="list-group">
          {groupedOffers.Active.map((offer) => (
            <li
              key={offer.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h5 className="mb-1">{offer.description}</h5>
                <small className="text-muted">Preis: {offer.price}€</small>
              </div>
              <span className="badge bg-success text-dark">Kunde {offer.customer_id}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* On Ice Angebote */}
      <div className="mb-4">
        <button
          className="btn btn-primary w-100 text-start"
          onClick={() => toggleSection('On Ice')}
        >
          {openSections['On Ice'] ? '▼' : '►'} On Ice Angebote
        </button>
        {openSections['On Ice'] && (
          <div className="card p-3 border-primary shadow-sm">
            <ul className="list-group">
              {groupedOffers.OnIce.map((offer) => (
                <li
                  key={offer.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h5 className="mb-1">{offer.description}</h5>
                    <small className="text-muted">Preis: {offer.price}€</small>
                  </div>
                  <span className="badge bg-warning text-dark">Kunde {offer.customer_id}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="text-center my-5">
        <DoughnutChart />
        <HighchartsChart />
      </div>
    </div>
  );
}
