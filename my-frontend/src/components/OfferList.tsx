import { useEffect, useState } from "react";
import axios from "axios";

interface Offer {
  id: number;
  description: string;
  price: number;
  status: string;
  customer_id: number;
}

export default function OfferList() {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    axios.get("http://localhost:8080/Offer/getOffers")
      .then((response) => setOffers(response.data))
      .catch((error) => console.error("Fehler beim Laden der Angebote:", error));
  }, []);

  return (
    <div>
      <h3>Liste der Angebote</h3>
      <ul>
        {offers.map((offer) => (
          <li key={offer.id}>
            {offer.description} - {offer.price}€ (Status: {offer.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
