import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { OffersPage } from './pages/Offers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OffersPage />} />
      </Routes>
    </Router>
  );
}

export default App;