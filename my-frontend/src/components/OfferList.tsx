import React, { useEffect, useState } from "react";
import axios from "axios";

interface Offer {
  id: number;
  description: string;
  price: number;
  customer_id: number;
  status: string;
}

interface Comment {
  id: number;
  comment: string;
  created_at: string;
}

export default function OfferList() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({});
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [editingComment, setEditingComment] = useState<{ id: number; offer_id: number; text: string } | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = () => {
    axios.get("http://localhost:8080/Offer/getOffers")
      .then((response) => {
        setOffers(response.data);
        response.data.forEach((offer: Offer) => fetchComments(offer.id));
      })
      .catch((error) => console.error("Fehler beim Laden der Angebote:", error));
  };

  const fetchComments = (offerId: number) => {
    axios.get(`http://localhost:8080/${offerId}/comments`)
      .then((response) => {
        setComments((prev) => ({ ...prev, [offerId]: response.data }));
      })
      .catch(() => setComments((prev) => ({ ...prev, [offerId]: [] })));
  };

  const handleDeleteOffer = (id: number) => {
    axios.delete("http://localhost:8080/Offer/deleteOffer", { data: { id } })
      .then(() => {
        setOffers(offers.filter(offer => offer.id !== id));
      })
      .catch((error) => console.error("Fehler beim Löschen des Angebots:", error));
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer({ ...offer });
  };

  const handleUpdateOffer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingOffer) return;
    axios.put("http://localhost:8080/Offer/updateOffer", editingOffer)
      .then(() => {
        setEditingOffer(null);
        fetchOffers();
      })
      .catch((error) => console.error("Fehler beim Aktualisieren des Angebots:", error));
  };

  return (
    <div className="container mt-5">
      <h2>Angebotsliste</h2>
      <ul className="list-group">
        {offers.map((offer) => (
          <li key={offer.id} className="list-group-item">
            <div>
              <h5>{offer.description}</h5>
              <small>Preis: {offer.price}€ | Kunde: {offer.customer_id} | Status: {offer.status}</small>
            </div>
            <button className="btn btn-warning btn-sm mx-1" onClick={() => handleEditOffer(offer)}>
              Bearbeiten
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteOffer(offer.id)}>
              Löschen
            </button>
            <div>
              <h6>Kommentare:</h6>
              <ul>
                {(comments[offer.id] || []).map((comment) => (
                  <li key={comment.id}>
                    {editingComment && editingComment.id === comment.id ? (
                      <>
                        <input
                          type="text"
                          value={editingComment.text}
                          onChange={(e) => setEditingComment({ ...editingComment, text: e.target.value })}
                        />
                        <button onClick={handleUpdateOffer}>Speichern</button>
                        <button onClick={() => setEditingComment(null)}>Abbrechen</button>
                      </>
                    ) : (
                      <>
                        {comment.comment} ({comment.created_at})
                        <button onClick={() => setEditingComment({ id: comment.id, offer_id: offer.id, text: comment.comment })}>Bearbeiten</button>
                        <button onClick={() => handleDeleteOffer(offer.id)}>Löschen</button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              <input
                type="text"
                placeholder="Neuer Kommentar"
                value={newComments[offer.id] || ""}
                onChange={(e) => setNewComments((prev) => ({ ...prev, [offer.id]: e.target.value }))}
              />
              <button onClick={() => handleUpdateOffer()}>Hinzufügen</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}