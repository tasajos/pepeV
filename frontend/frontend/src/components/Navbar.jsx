import React from 'react';
import './Navbar.css';

const Navbar = ({ searchTerm, handleSearchChange }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <a href="/">
            <img src="/pepe_vende-remove.png" alt="Pepe Vende" />
            <span className="logo-text"> Pepe Vende - Tienda Online</span>
          </a>
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
          <li><a href="/">Inicio</a></li>
          <li><a href="/productos">Productos</a></li>
          <li><a href="/contacto">Contacto</a></li>
        </ul>
        <div className="navbar-auth">
          <button className="btn-login">Login</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;