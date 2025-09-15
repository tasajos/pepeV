// src/components/ShoppingCart.jsx

import React from 'react';
import './ShoppingCart.css';

const ShoppingCart = ({ cartItems, onRemoveItem, onCheckout }) => {
  const totalPrice = cartItems.reduce((total, item) => total + Number(item.precio) * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2>Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.imagen} alt={item.nombre} className="cart-item-image" />
                <div className="item-details">
                  <h3>{item.nombre}</h3>
                  <p>Precio: Bs {Number(item.precio).toFixed(2)}</p>
                  <p>Cantidad: {item.quantity}</p>
                </div>
                <button className="remove-item-btn" onClick={() => onRemoveItem(item.id)}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <h3>Total: Bs {totalPrice.toFixed(2)}</h3>
            <button className="checkout-btn" onClick={onCheckout}>Proceder al Pago</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;