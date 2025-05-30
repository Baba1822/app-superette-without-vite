import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CustomerNavigation.css';

const CustomerNavigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="customer-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">Mon Application</Link>
        </div>
        
        <ul className="nav-links">
          <li className={isActive('/dashboard')}>
            <Link to="/dashboard">
              <i className="fas fa-home"></i>
              Tableau de bord
            </Link>
          </li>
          <li className={isActive('/profile')}>
            <Link to="/profile">
              <i className="fas fa-user"></i>
              Profil
            </Link>
          </li>
          <li className={isActive('/orders')}>
            <Link to="/orders">
              <i className="fas fa-shopping-bag"></i>
              Commandes
            </Link>
          </li>
          <li className={isActive('/support')}>
            <Link to="/support">
              <i className="fas fa-headset"></i>
              Support
            </Link>
          </li>
        </ul>

        <div className="nav-actions">
          <button className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
};

export default CustomerNavigation; 