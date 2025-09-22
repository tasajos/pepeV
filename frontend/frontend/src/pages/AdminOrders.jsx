// src/pages/AdminOrders.jsx

import React, { useState, useEffect } from 'react';
import './AdminOrders.css';

const estados = ['Pendiente', 'Completado', 'En Progreso', 'Incompleto'];

const AdminOrders = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPedido, setExpandedPedido] = useState(null); // Nuevo estado para la fila expandida

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
  
  const handleToggleDetails = async (pedido) => {
    if (expandedPedido && expandedPedido.id === pedido.id) {
      setExpandedPedido(null); // Cierra la fila si ya está abierta
    } else {
      // Abre la fila y busca los detalles del pedido
      try {
        const response = await fetch(`http://localhost:5000/api/pedidos/${pedido.id}/details`);
        if (!response.ok) throw new Error('No se pudieron cargar los detalles del pedido');
        const details = await response.json();
        setExpandedPedido({ ...pedido, details });
      } catch (err) {
        console.error(err);
        setExpandedPedido(null);
      }
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
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(pedido => (
            <React.Fragment key={pedido.id}>
              <tr onClick={() => handleToggleDetails(pedido)} className="pedido-row">
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
                    onClick={(e) => e.stopPropagation()} // Evita que se cierre la fila
                  >
                    {estados.map(estado => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </td>
                <td>{expandedPedido && expandedPedido.id === pedido.id ? '▲' : '▼'}</td>
              </tr>
              {expandedPedido && expandedPedido.id === pedido.id && (
                <tr className="details-row">
                  <td colSpan="7">
                    <div className="details-container">
                      <h4>Productos del Pedido:</h4>
                      <ul className="details-list">
                        {expandedPedido.details.map(detail => (
                          <li key={detail.nombre} className="details-item">
                            <img src={detail.imagen} alt={detail.nombre} className="product-thumb" />
                            <span>{detail.nombre} (x{detail.cantidad})</span>
                            <span>Bs {Number(detail.precio_unitario).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;