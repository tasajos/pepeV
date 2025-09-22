import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './AddProductPage.css';

const categories = ['Tecnologia','Animales', 'Alimentos', 'Bebidas', 'Congelados', 'Cuidado Personal', 'Ropas', 'Juguetes','Hogar','Vehiculos'];

const AddProductPage = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
   const [cantidad, setCantidad] = useState(''); // Nuevo estado para la cantidad
  const [category, setCategory] = useState(categories[0]);
  const [imagen, setImagen] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // 1. Subir la imagen a Firebase Storage
      const imageRef = ref(storage, `pepevende/products/${imagen.name}`);
      await uploadBytes(imageRef, imagen);
      const imageUrl = await getDownloadURL(imageRef);

      // 2. Guardar la URL y otros datos en la base de datos
      const response = await fetch('http://localhost:5000/api/productos/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, precio, imagen: imageUrl, category }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el producto en la base de datos.');
      }
      
      setMessage('Producto añadido con éxito.');
      setTimeout(() => navigate('/admin-dashboard'), 2000); // Redirige después de 2 segundos
      
    } catch (error) {
      console.error('Error:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="form-card">
        <h2>Añadir Nuevo Producto</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Precio (Bs):</label>
            <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Cantidad:</label>
            <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
          </div>


          <div className="form-group">
            <label>Categoría:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Imagen:</label>
            <input type="file" onChange={handleFileChange} required />
          </div>
          
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Subiendo...' : 'Añadir Producto'}
          </button>
        </form>
        {message && <p className="status-message">{message}</p>}
      </div>
    </div>
  );
};

export default AddProductPage;