// src/components/ProductModal.jsx

import React, { useState } from 'react';
import './ProductModal.css';

const ProductModal = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    // Asegura que el valor sea un número y no sea negativo
    const value = Number(e.target.value);
    setQuantity(value >= 1 ? value : 1);
  };

  const handleAddClick = () => {
    // Llama a la función onAddToCart una sola vez con la cantidad seleccionada
    onAddToCart(product, quantity);
    onClose(); // Cierra el modal después de agregar al carrito
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <div className="product-modal-inner">
          <div className="modal-image-container">
            <img src={product.imagen} alt={product.nombre} className="modal-image-full" />
          </div>
          <div className="modal-product-details">
            <h2>{product.nombre}</h2>
            <p className="modal-description">{product.descripcion}</p>
            <p className="modal-price">Precio: Bs {Number(product.precio).toFixed(2)}</p>
            <div className="modal-quantity-selector">
              <label>Cantidad:</label>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={handleQuantityChange} 
                className="quantity-input"
              />
            </div>
            <button className="add-to-cart-modal-btn" onClick={handleAddClick}>
              Agregar {quantity > 1 ? `(${quantity} items)` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;