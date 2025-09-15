// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import Footer from './components/Footer';
import ShoppingCart from './components/ShoppingCart'; 
import PaymentModal from './components/PaymentModal';

const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

const CategoryPage = ({ searchTerm, handleAddToCart }) => {
  const { categoryName } = useParams();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    let url = 'http://localhost:5000/api/productos';
    
    if (categoryName) {
      const formattedCategoryName = toTitleCase(categoryName);
      url = `http://localhost:5000/api/productos/${formattedCategoryName}`;
    }
    
    fetch(url)
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error al cargar los productos:', error));
  }, [categoryName]);

  const filteredProducts = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header className="main-header">
        <h1>{categoryName ? toTitleCase(categoryName) : 'Tienda Virtual'} 🛒</h1>
        <p>Los mejores productos a tu alcance</p>
      </header>
      <div className="productos-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(producto => (
            <div key={producto.id} className="producto">
              <img src={producto.imagen} alt={producto.nombre} className="producto-imagen" />
              <h2>{producto.nombre}</h2>
              <p>{producto.descripcion}</p>
              <p className="producto-precio">Precio: Bs {producto.precio}</p>
              <button className="add-to-cart-btn" onClick={() => handleAddToCart(producto)}>
                Agregar al Carrito
              </button>
            </div>
          ))
        ) : (
          <p>No se encontraron productos en esta categoría.</p>
        )}
      </div>
    </>
  );
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleAddToCart = (product) => {
    const productExists = cartItems.find(item => item.id === product.id);

    if (productExists) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const totalPrice = cartItems.reduce((total, item) => total + Number(item.precio) * item.quantity, 0);

  return (
    <Router>
      <div className="App">
        <Navbar searchTerm={searchTerm} handleSearchChange={handleSearchChange} cartItemCount={cartItemCount} />
        <CategoryBar />
        <Routes>
          <Route path="/" element={<CategoryPage searchTerm={searchTerm} handleAddToCart={handleAddToCart} />} />
          <Route path="/categoria/:categoryName" element={<CategoryPage searchTerm={searchTerm} handleAddToCart={handleAddToCart} />} />
          {/* Add the onCheckout prop to the ShoppingCart component */}
          <Route path="/cart" element={<ShoppingCart cartItems={cartItems} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} />} />
        </Routes>
        <Footer />
        {isModalOpen && (
          <PaymentModal
            cartItems={cartItems}
            totalPrice={totalPrice}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </Router>
  );
}

export default App;