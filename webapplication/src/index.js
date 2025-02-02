import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Customers from './customers.jsx'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Customers /> {/* Ersetze App durch Customers */}
  </React.StrictMode>
);



