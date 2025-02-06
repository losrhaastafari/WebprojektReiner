import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import OfferForm from "./components/OfferForm";
import OfferList from "./components/OfferList";
import CustomerForm from "./components/CustomerForm";
import CustomerList from "./components/CustomerList";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/offers" element={<><OfferForm /><OfferList /></>} />
        <Route path="/customers" element={<><CustomerForm /><CustomerList /></>} />
      </Routes>
    </Router>
  );
}
