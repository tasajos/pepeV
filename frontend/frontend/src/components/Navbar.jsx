// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

// Recibe la nueva prop cartItemCount
const Navbar = ({ searchTerm, handleSearchChange, cartItemCount }) => {
  const { user, role, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

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
              {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
            </Link>
          </li>
        </ul>
        <div className="navbar-auth">
          {loading ? (
            <p>Cargando...</p>
          ) : user ? (
            <>
              <p className="user-info">Hola, {user.email}!</p>
              <button className="btn-logout" onClick={handleLogout}>Cerrar Sesión</button>
            </>
          ) : (
            <Link to="/login">
              <button className="btn-login">Iniciar Sesión</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;