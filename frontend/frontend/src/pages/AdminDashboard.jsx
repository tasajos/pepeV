// src/pages/AdminDashboard.jsx

import React from 'react';
import './AdminDashboard.css';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate, useNavigate } from 'react-router-dom'; // Importar useNavigate

const AdminDashboard = () => {
  const { user, role, loading, logout } = useAuth(); // Importar la función logout
  const navigate = useNavigate(); // Hook de navegación

  if (loading) {
    return <div>Cargando...</div>;
  }
  
  if (!user || role !== 'Administrador') {
    return <Navigate to="/" />;
  }
  
  const handleLogout = () => {
    logout(); // Llama a la función de logout del contexto
    navigate('/login', { replace: true }); // Redirige a la página de login
  };

  return (
    <div className="admin-container">
      <nav className="admin-navbar">
        <div className="admin-logo">Panel de Administración</div>
        <div className="admin-auth">
          <span className="user-info">Hola, {user.email}!</span>
          <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
        </div>
      </nav>
      <div className="admin-cards-container">
        <Link to="/admin/add-product" className="admin-card">
          <div className="card-icon">➕</div>
          <div className="card-title">Añadir Productos</div>
        </Link>
        <Link to="/admin/view-users" className="admin-card">
          <div className="card-icon">👥</div>
          <div className="card-title">Ver Usuarios</div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;