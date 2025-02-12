import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MDBBadge, MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons"; // Importiere Icons
import "./styles/OfferTable.css"; 

export default function CustomerTable() {
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/Offer/getOffers")
      .then((response) => response.json())
      .then((data) => {
        setOffers(data);
      })
      .catch((error) => console.error("Error fetching offers:", error));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      fetch(`http://localhost:8080/deleteOffer`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Delete response:", data);
        setOffers(offers.filter((offer) => offer.id !== id));
      })
      .catch((error) => console.error("Error deleting offer:", error));
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-offer/${id}`);
  };

  return (
    <MDBTable className="OfferTable" align="middle">
      <MDBTableHead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col">Price</th>
          <th scope="col">Status</th>
          <th scope="col">Actions</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {offers.length > 0 ? (
          offers.map((offer) => (
            <tr key={offer.id}>
              <td>
                <div className="d-flex align-items-center">
                  <div className="ms-3">
                    <p className="fw-bold mb-1">{offer.customer_id}</p>
                  </div>
                </div>
              </td>
              <td>
                <p className="fw-normal mb-1">{offer.description}</p>
              </td>
              <td>{offer.price} €</td>
              <td>
                <MDBBadge
                  color={
                    offer.status === "Active"
                      ? "success"
                      : offer.status === "On Ice"
                      ? "info"
                      : offer.status === "Draft"
                      ? "warning"
                      : offer.status === "In Progress"
                      ? "danger"
                      : "secondary"
                  }
                  pill
                >
                  {offer.status}
                </MDBBadge>
              </td>
              <td>
                {/* Stift-Icon für Bearbeiten */}
                <FontAwesomeIcon
                  icon={faEdit}
                  className="text-warning me-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdit(offer.id)}
                  title="Edit Offer"
                />
                {/* Mülleimer-Icon für Löschen */}
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDelete(offer.id)}
                  title="Delete Offer"
                />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center">
              No offers available
            </td>
          </tr>
        )}
      </MDBTableBody>
    </MDBTable>
  );
}
