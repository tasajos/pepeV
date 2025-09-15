/* src/App.jsx */

import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CategoryBar from './components/CategoryBar'; // Importa el nuevo componente

function App() {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/productos')
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error al cargar los productos:', error));
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      {/* Pasa las props del buscador al Navbar */}
      <Navbar searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <CategoryBar />
      <header className="main-header">
        <h1>Tienda Virtual 🛒</h1>
        <p>Los mejores productos a tu alcance</p>
      </header>
      <div className="productos-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(producto => (
            <div key={producto.id} className="producto">
              <h2>{producto.nombre}</h2>
              <p>{producto.descripcion}</p>
              <p className="producto-precio">Precio: ${producto.precio}</p>
            </div>
          ))
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;