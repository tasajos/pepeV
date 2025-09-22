// src/pages/AdminOrders.jsx

import React, { useState, useEffect } from 'react';
import './AdminOrders.css';
import { useAuth } from '../context/AuthContext';

const estados = ['Pendiente', 'Completado', 'En Progreso', 'Incompleto'];

const AdminOrders = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, role } = useAuth();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pedidos/all');
        if (!response.ok) {
          throw new Error('No se pudieron cargar los pedidos');
        }
        const data = await response.json();
        setPedidos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  const handleStatusChange = async (pedidoId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pedidos/${pedidoId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado en el servidor.');
      }
      
      setPedidos(prevPedidos => prevPedidos.map(p =>
        p.id === pedidoId ? { ...p, estado: newStatus } : p
      ));
      
    } catch (err) {
      console.error('Error:', err);
      setError('Error al conectar con el servidor.');
    }
  };

  if (loading) return <div>Cargando pedidos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-orders-container">
      <h2>Gestión de Pedidos</h2>
      <table className="pedidos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Teléfono</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(pedido => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.nombre_cliente}</td>
              <td>{pedido.telefono}</td>
              <td>Bs {Number(pedido.total_pedido).toFixed(2)}</td>
              <td>{new Date(pedido.fecha_pedido).toLocaleString()}</td>
              <td>
                <select
                  value={pedido.estado}
                  onChange={(e) => handleStatusChange(pedido.id, e.target.value)}
                  className={`status-select ${pedido.estado.toLowerCase().replace(' ', '-')}`}
                >
                  {estados.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;