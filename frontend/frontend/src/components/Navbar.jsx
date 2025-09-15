// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

// Recibe la nueva prop cartItemCount
const Navbar = ({ searchTerm, handleSearchChange, cartItemCount }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/pepe_vende-remove.png" alt="Pepe Vende" />
            <span className="logo-text"> Pepe Vende - Tienda Online</span>
          </Link>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>
      <div className="navbar-right">
        <ul className="navbar-links">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
          <li className="cart-icon-container">
            <Link to="/cart">
              <span className="cart-icon">🛒</span>
              {/* Muestra el contador si es mayor que 0 */}
              {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
            </Link>
          </li>
        </ul>
        <div className="navbar-auth">
          <button className="btn-login">Login</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;