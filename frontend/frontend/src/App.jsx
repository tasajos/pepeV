// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import Footer from './components/Footer';

// Mueve la función toTitleCase fuera del componente
// para que esté disponible globalmente en este archivo.
const toTitleCase = (str) => {
  if (!str) return ''; // Maneja el caso de que la cadena sea undefined o nula
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Nuevo componente para la página de la categoría
const CategoryPage = ({ searchTerm }) => {
  const { categoryName } = useParams();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Determina la URL base
    let url = 'http://localhost:5000/api/productos';
    
    // Si hay un nombre de categoría, ajusta la URL
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Router>
      <div className="App">
        <Navbar searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
        <CategoryBar />
        <Routes>
          <Route path="/" element={<CategoryPage searchTerm={searchTerm} />} />
          <Route path="/categoria/:categoryName" element={<CategoryPage searchTerm={searchTerm} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;