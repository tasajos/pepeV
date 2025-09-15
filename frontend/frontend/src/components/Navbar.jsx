import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">
        <img src="/pepe_vende-remove.png" alt="Pepe Vende" />
          <span className="logo-text"> Pepe Vende - Tienda Online</span>
          {/*<span className="logo-icon">🛒</span>*/}
        </a>
      </div>
      <ul className="navbar-links">
        <li><a href="/">Inicio</a></li>
        <li><a href="/productos">Productos</a></li>
        <li><a href="/contacto">Contacto</a></li>
      </ul>
      <div className="navbar-auth">
        <button className="btn-login">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;