import '../styles/sidebar.css';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar-info col-2 position-fixed">
        <div className="list-group"> 
            <div className="m-1 p-1">
                <button className="btn btn-primary w-100" onClick={() => navigate('/customers')}>Kunden</button>
            </div>
            <div className="m-1 p-1">
                <button className="btn btn-primary w-100"  onClick={() => navigate('/offers')}>Angebote</button>
            </div>
        </div>
    </div>
  );
}