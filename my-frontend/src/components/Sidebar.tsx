import '../styles/sidebar.css';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar-info col-2 position-fixed">
        <div className="list-group">  
            <div className="m-1 p-1"> 
              <button className="btn btn-light flex-grow-1" onClick={() => navigate('/customers')}>
              <i className="fas fa-solid fa-user mx-4"></i>
                Kunden
              </button>
            </div>
            <div className="m-1 p-1">
                <button className="btn btn-light flex-grow-1"  onClick={() => navigate('/offers')}>
                <i className="fa-solid fa-file mx-4"></i>
                  Angebote</button>
            </div>
        </div>
    </div>
  );
}