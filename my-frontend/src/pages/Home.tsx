import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Willkommen im Angebotssystem</h1>
      <nav>
        <Link to="/offers">📋 Angebote anzeigen</Link>
        <Link to="/customers">👥 Kunden anzeigen</Link>
      </nav>
    </div>
  );
}
