import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import OfferForm from "./components/OfferForm";
import OfferList from "./components/OfferList";
import CustomerForm from "./components/CustomerForm";
import CustomerList from "./components/CustomerList";
import Sidebar from "./components/Sidebar";
import React, { useState } from 'react';
import CustomerTable from "./components/Offer-Table-Test";

export default function App() {
  const [reloadCustomers, setReloadCustomers] = useState(false);

  const handleCustomerCreated = () => {
    setReloadCustomers(!reloadCustomers); // Toggle reload state
  };

  return (
    <Router>
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
              <Route path="/Test" element={<CustomerTable />}></Route>
            </Routes>
          </div>
        </div>
      <div></div>
      </Router>
  );
}