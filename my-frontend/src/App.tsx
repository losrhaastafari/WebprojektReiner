import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import OfferForm from "./components/OfferForm";
import OfferList from "./components/OfferList";
import CustomerForm from "./components/CustomerForm";
import CustomerList from "./components/CustomerList";
import Sidebar from "./components/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <Router>
      <div className="container-fluid p-0">
        <div className="row m-0">
          <div className="col-md-3 p-0">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/offers" element={<><OfferForm /><OfferList /></>} />
              <Route path="/customers" element={<><CustomerForm /><CustomerList /></>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
