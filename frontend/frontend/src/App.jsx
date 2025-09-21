// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import Footer from './components/Footer';
import ShoppingCart from './components/ShoppingCart'; 
import PaymentModal from './components/PaymentModal';
import ProductModal from './components/ProductModal';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import AddProductPage from './pages/AddProductPage'; 
import AdminLayout from './components/AdminLayout';
import AdminProducts from './pages/AdminProducts';
import ConfigurationPage from './pages/ConfigurationPage'; // Nuevo import

const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Componente para la página principal de productos
const CategoryPage = ({ searchTerm, handleAddToCart }) => {
  const { categoryName } = useParams();
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
  
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
  };
  
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };




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
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="producto-imagen"
                onClick={() => handleOpenModal(producto)}
              />
              <h2>{producto.nombre}</h2>
              <p>{producto.descripcion}</p>
              {/* Muestra el nuevo precio de venta */}
              <p className="producto-precio">Precio: Bs {Number(producto.precio_venta).toFixed(2)}</p>
              <button className="add-to-cart-btn" onClick={() => handleAddToCart(producto, 1)}>
                Agregar al Carrito
              </button>
            </div>
          ))
        ) : (
          <p>No se encontraron productos en esta categoría.</p>
        )}
      </div>
      
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={handleCloseModal} 
          onAddToCart={handleAddToCart} 
        />
      )}
    </>
  );
};

function MainApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { user, role, loading } = useAuth();
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleAddToCart = (product, quantity = 1) => {
    const productExists = cartItems.find(item => item.id === product.id);
    if (productExists) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: quantity }]);
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

  const totalPrice = cartItems.reduce((total, item) => total + Number(item.precio_venta) * item.quantity, 0);
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  // Si el usuario es administrador, usa el AdminLayout para todas las rutas del panel
  if (user && role === 'Administrador') {
    return (
      <AdminLayout>
        <Routes>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard/add-product" element={<AddProductPage />} />
           <Route path="/admin-dashboard/view-products" element={<AdminProducts />} /> {/* Nueva ruta */}
           <Route path="/admin-dashboard/config" element={<ConfigurationPage />} /> {/* Nueva ruta */}
          {/* Añade aquí más rutas del panel de administrador */}
        </Routes>
      </AdminLayout>
    );
  }

  // Layout para clientes y usuarios no autenticados
  return (
    <div className="App">
      <Navbar searchTerm={searchTerm} handleSearchChange={handleSearchChange} cartItemCount={cartItemCount} />
      <CategoryBar />
      <Routes>
        <Route path="/" element={<CategoryPage searchTerm={searchTerm} handleAddToCart={handleAddToCart} />} />
        <Route path="/categoria/:categoryName" element={<CategoryPage searchTerm={searchTerm} handleAddToCart={handleAddToCart} />} />
        <Route path="/cart" element={<ShoppingCart cartItems={cartItems} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} />} />
        <Route path="/login" element={<LoginPage />} />
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
  );
}

const AppWrapper = () => (
  <Router>
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  </Router>
);

export default AppWrapper;