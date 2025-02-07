import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import OfferForm from "./components/OfferForm";
import OfferList from "./components/OfferList";
import CustomerForm from "./components/CustomerForm";
import CustomerList from "./components/CustomerList";
import Sidebar from "./components/Sidebar";
import React, { useState } from 'react';

export default function App() {
  const [reloadCustomers, setReloadCustomers] = useState(false);

  const handleCustomerCreated = () => {
    setReloadCustomers(!reloadCustomers); // Toggle reload state
  };

  return (
    <Router>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/offers" element={<><OfferForm /><OfferList /></>} />
              <Route path="/customers" element={
                <>
                  <CustomerForm onCustomerCreated={handleCustomerCreated} />
                  <CustomerList key={reloadCustomers} />
                </>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}