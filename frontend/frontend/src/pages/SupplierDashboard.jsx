// src/pages/SupplierDashboard.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth'; // Asegúrate de que esto siga siendo de Firebase
import { auth } from '../firebase'; // Asegúrate de que esto siga siendo de Firebase
import './SupplierDashboard.css';

const SupplierDashboard = () => {
  const { user, role, loading, logout } = useAuth();
  const navigate = useNavigate();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  // Si el usuario no es Proveedor, redirige al inicio
  if (!user || role !== 'Proveedor') {
    return <Navigate to="/" />;
  }
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="supplier-container">
      <nav className="admin-navbar">
        <div className="admin-left">
          <Link to="/supplier-dashboard" className="admin-logo">
            Panel de Proveedor
          </Link>
          <div className="admin-nav-links">
            <Link to="/supplier-dashboard/add-product" className="admin-nav-link">Añadir Producto</Link>
          </div>
        </div>
        <div className="admin-right">
          <span className="user-info">Hola, {user.email}!</span>
          <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
        </div>
      </nav>
      <div className="admin-cards-container">
        <Link to="/supplier-dashboard/add-product" className="admin-card">
          <div className="card-icon">➕</div>
          <div className="card-title">Añadir Productos</div>
        </Link>
      </div>
    </div>
  );
};

export default SupplierDashboard;