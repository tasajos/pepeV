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
        const response = await fetch('http://localhost:5000/api/productos');
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
    // Lógica para actualizar el estado del producto en el backend
    // Esto requiere un nuevo endpoint en el backend que debes crear
    console.log(`Cambiando estado del producto ${productId} a ${newStatus}`);
    // Una vez que el backend responda, actualiza el estado local
    setProductos(prevProducts => prevProducts.map(p =>
      p.id === productId ? { ...p, status: newStatus } : p
    ));
  };

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-products-container">
      <div className="products-grid">
        {productos.map(producto => (
          <div key={producto.id} className="admin-product-card">
            <img src={producto.imagen} alt={producto.nombre} className="admin-product-image" />
            <div className="admin-product-details">
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              <p>Precio: Bs {producto.precio}</p>
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