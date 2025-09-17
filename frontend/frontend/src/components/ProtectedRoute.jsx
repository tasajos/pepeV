// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se verifica la autenticación
  }

  // Si el usuario no está logueado O su rol no es el requerido, redirige a la página principal
  if (!user || role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Si el usuario cumple con los requisitos, muestra el componente hijo
  return children;
};

export default ProtectedRoute;