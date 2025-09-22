// src/components/AdminLayout.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth'; // Asegúrate de que esto siga siendo de Firebase
import { auth } from '../firebase'; // Asegúrate de que esto siga siendo de Firebase
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    <div className="admin-container">
      <nav className="admin-navbar">
        <div className="admin-left">
          <Link to="/admin-dashboard" className="admin-logo">
            Panel de Administración
          </Link>
          <div className="admin-nav-links">
            <Link to="/admin-dashboard/add-product" className="admin-nav-link">Añadir Producto</Link>
           <Link to="/admin-dashboard/view-products" className="admin-nav-link">Ver Productos</Link> 
            <Link to="/admin-dashboard/view-orders" className="admin-nav-link">Ver Pedidos</Link>
           <Link to="/admin-dashboard/config" className="admin-nav-link">Configuración</Link> {/* Nuevo enlace */}
            <Link to="/admin-dashboard/view-users" className="admin-nav-link">Ver Usuarios</Link>
          </div>
        </div>
        <div className="admin-right">
          <span className="user-info">Hola, {user.email}!</span>
          <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
        </div>
      </nav>
      <div className="admin-content">
        {children} {/* Aquí se renderizarán las rutas hijas */}
      </div>
    </div>
  );
};

export default AdminLayout;