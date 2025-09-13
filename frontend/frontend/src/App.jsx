// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import './App.css';

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
      <header className="App-header">
        <h1>Tienda Virtual 🛒</h1>
      </header>
      <div className="productos-container">
        {productos.length > 0 ? (
          productos.map(producto => (
            <div key={producto.id} className="producto">
              <h2>{producto.nombre}</h2>
              <p>{producto.descripcion}</p>
              <p>Precio: ${producto.precio}</p>
            </div>
          ))
        ) : (
          <p>Cargando productos...</p>
        )}
      </div>
    </div>
  );
}

export default App;