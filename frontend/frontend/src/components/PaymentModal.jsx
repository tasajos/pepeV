import React, { useState } from 'react';
import './PaymentModal.css';
import MapPicker from './MapPicker'; // Importa el componente del mapa

const PaymentModal = ({ cartItems, totalPrice, onClose }) => {
  const [name, setName] = useState('');
  const [paternalLastName, setPaternalLastName] = useState('');
  const [maternalLastName, setMaternalLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  const handleWhatsAppOrder = () => {
    let message = `¡Hola! Me gustaría hacer un pedido.\n\n`;
    message += `*Datos del Cliente:*\n`;
    message += `Nombre: ${name} ${paternalLastName} ${maternalLastName}\n`;
    message += `Teléfono: ${phone}\n\n`;
    message += `*Productos:*\n`;
    
    cartItems.forEach(item => {
      message += `- ${item.nombre} (x${item.quantity}) - Bs ${Number(item.precio).toFixed(2)}\n`;
    });
    
    message += `\n*Total a pagar: Bs ${Number(totalPrice).toFixed(2)}*\n\n`;
    
    // Si la ubicación fue seleccionada, agrega el enlace al mensaje
    if (deliveryLocation) {
      const { lat, lng } = deliveryLocation;
      message += `*Ubicación de Entrega:*\n`;
      message += `https://www.google.com/maps/place/${lat},${lng}`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/59168503758?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    onClose();
  };

  const handleLocationSelect = (location) => {
    setDeliveryLocation(location);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2>Resumen del Pedido</h2>
        <div className="modal-items-list">
          {cartItems.map(item => (
            <div key={item.id} className="modal-item">
              <span>{item.nombre} (x{item.quantity})</span>
              <span>Bs {Number(item.precio).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="modal-total">
          <strong>Total: Bs {Number(totalPrice).toFixed(2)}</strong>
        </div>
        <hr />
        <h3>Datos Personales y Ubicación</h3>
        <form onSubmit={(e) => { e.preventDefault(); handleWhatsAppOrder(); }}>
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Apellido Paterno</label>
            <input type="text" value={paternalLastName} onChange={(e) => setPaternalLastName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Apellido Materno</label>
            <input type="text" value={maternalLastName} onChange={(e) => setMaternalLastName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Teléfono (WhatsApp)</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="map-section">
            <label>Selecciona tu ubicación de entrega</label>
            <MapPicker onLocationSelect={handleLocationSelect} />
            {deliveryLocation && (
              <p className="location-info">Ubicación seleccionada: Latitud {deliveryLocation.lat.toFixed(4)}, Longitud {deliveryLocation.lng.toFixed(4)}</p>
            )}
          </div>

          <button type="submit" className="confirm-btn">Confirmar Pedido por WhatsApp</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;