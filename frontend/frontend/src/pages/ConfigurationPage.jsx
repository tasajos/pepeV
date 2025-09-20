// src/pages/ConfigurationPage.jsx

import React, { useState, useEffect } from 'react';
import './ConfigurationPage.css';

const ConfigurationPage = () => {
  const [config, setConfig] = useState({
    porcentaje_venta: '',
    costo_servicio: '',
    whatsapp_nro: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isUpdatingAllPrices, setIsUpdatingAllPrices] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/config');
        if (!response.ok) {
          throw new Error('No se pudo cargar la configuración.');
        }
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        setMessage(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prevConfig => ({
      ...prevConfig,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Guardando...');
    try {
      for (const [key, value] of Object.entries(config)) {
        const response = await fetch('http://localhost:5000/api/config', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ setting_name: key, setting_value: value })
        });
        if (!response.ok) {
          throw new Error(`Error al guardar ${key}.`);
        }
      }
      setMessage('Configuración guardada con éxito.');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleUpdateAllPrices = async () => {
    setIsUpdatingAllPrices(true);
    setMessage('Actualizando todos los precios...');
    try {
      const response = await fetch('http://localhost:5000/api/productos/update-prices', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Error al actualizar los precios en el servidor.');
      }
      setMessage('Todos los precios han sido actualizados con éxito.');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsUpdatingAllPrices(false);
    }
  };

  if (loading) return <div>Cargando configuración...</div>;

  return (
    <div className="config-container">
      <div className="config-card">
        <h2>Configuración de la Tienda</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Porcentaje de Venta (%):</label>
            <input type="number" name="porcentaje_venta" value={config.porcentaje_venta} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Costo del Servicio (Bs):</label>
            <input type="number" name="costo_servicio" value={config.costo_servicio} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Nro de Whatsapp de la Tienda:</label>
            <input type="text" name="whatsapp_nro" value={config.whatsapp_nro} onChange={handleChange} />
          </div>
          <button type="submit" className="save-btn">Guardar Cambios</button>
        </form>
        {message && <p className="status-message">{message}</p>}
      </div>
      <div className="update-prices-section">
        <h3>Actualización de Precios</h3>
        <p>Utilice este botón para recalcular todos los precios de venta en base al porcentaje de venta actual.</p>
        <button 
          onClick={handleUpdateAllPrices} 
          className="update-prices-btn" 
          disabled={isUpdatingAllPrices}
        >
          {isUpdatingAllPrices ? 'Actualizando...' : 'Actualizar Todos los Precios'}
        </button>
      </div>
    </div>
  );
};

export default ConfigurationPage;