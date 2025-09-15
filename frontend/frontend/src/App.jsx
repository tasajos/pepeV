/* src/App.jsx */

import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/productos')
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error al cargar los productos:', error));
  }, []);

  return (
    <div className="App">
      <Navbar />
      <header className="main-header">
        <h1>Tienda Virtual 🛒</h1>
        <p>Los mejores productos a tu alcance</p>
      </header>
      <div className="productos-container">
        {productos.length > 0 ? (
          productos.map(producto => (
            <div key={producto.id} className="producto">
              <h2>{producto.nombre}</h2>
              <p>{producto.descripcion}</p>
              <p className="producto-precio">Precio: ${producto.precio}</p>
            </div>
          ))
        ) : (
          <p>Cargando productos...</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;