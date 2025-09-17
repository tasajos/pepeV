// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error de autenticación.');
      }

      const userData = await response.json();
      login(userData); // Guarda los datos del usuario en el contexto
      
      if (userData.role === 'Administrador') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
    
      <div className="login-card">
        <h1>Iniciar Sesión</h1>
        <img src="/pepe_vende-remove.png" alt="Pepe Vende Logo" className="login-logo" />
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={isLoading}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Acceder'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;