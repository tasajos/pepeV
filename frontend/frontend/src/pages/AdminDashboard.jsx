// src/pages/AdminDashboard.jsx

import React from 'react';
import './AdminDashboard.css';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const AdminDashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  if (!user || role !== 'Administrador') {
    return <Navigate to="/" />;
  }
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="admin-container">
      
      <div className="admin-cards-container">
        <Link to="/admin-dashboard/add-product" className="admin-card">
          <div className="card-icon">➕</div>
          <div className="card-title">Añadir Productos</div>
        </Link>
        <Link to="/admin-dashboard/view-products" className="admin-card"> {/* Enlace actualizado */}
          <div className="card-icon">👁️</div>
          <div className="card-title">Ver Productos</div>
        </Link>
        <Link to="/admin-dashboard/view-users" className="admin-card">
          <div className="card-icon">👥</div>
          <div className="card-title">Ver Usuarios</div>
        </Link>
           <Link to="/admin-dashboard/config" className="admin-card">
            <div className="card-icon">⚙️</div>
            <div className="card-title">Configuración</div>
          </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;