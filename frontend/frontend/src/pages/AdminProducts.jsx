// src/pages/AdminProducts.jsx

import React, { useState, useEffect } from 'react';
import './AdminProducts.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminProducts = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // La URL ahora es para obtener TODOS los productos
        const response = await fetch('http://localhost:5000/api/productos/all'); 
        if (!response.ok) {
          throw new Error('No se pudieron cargar los productos');
        }
        const data = await response.json();
        setProductos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleStatusChange = async (productId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    
    try {
      const response = await fetch(`http://localhost:5000/api/productos/${productId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado en el servidor.');
      }
      
      setProductos(prevProducts => prevProducts.map(p =>
        p.id === productId ? { ...p, status: newStatus } : p
      ));
      
    } catch (err) {
      console.error('Error:', err);
      setError('Error al conectar con el servidor.');
    }
  };

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

 return (
    <div className="admin-products-container">
      <h2>Gestión de Productos</h2>
      <div className="products-grid">
        {productos.map(producto => (
          <div key={producto.id} className="admin-product-card">
            <img src={producto.imagen} alt={producto.nombre} className="admin-product-image" />
            <div className="admin-product-details">
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              {/* Muestra ambos precios para el administrador */}
              <p className="admin-price">Precio de Costo: Bs {Number(producto.precio).toFixed(2)}</p>
              <p className="admin-price-sale">Precio de Venta: Bs {Number(producto.precio_venta).toFixed(2)}</p>
              <div className="status-toggle">
                <span className={`status-badge ${producto.status === 1 ? 'active' : 'inactive'}`}>
                  {producto.status === 1 ? 'Habilitado' : 'Deshabilitado'}
                </span>
                <button
                  onClick={() => handleStatusChange(producto.id, producto.status)}
                  className="status-btn"
                >
                  Cambiar Estado
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;