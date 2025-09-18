// backend/server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL 🚀');
});

// Ruta para verificar email y password y devolver el rol
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const query = 'SELECT id, email, role, status FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error en la base de datos:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    if (results.length > 0) {
      const user = results[0];
      if (user.status === 0) {
        return res.status(401).json({ error: 'Usuario deshabilitado' });
      }
      return res.status(200).json({ id: user.id, email: user.email, role: user.role, status: user.status });
    } else {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  });
});

// Ruta para obtener todos los productos (solo los habilitados)
app.get('/api/productos', (req, res) => {
  const query = 'SELECT * FROM productos WHERE status = 1';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener los productos');
      return;
    }
    res.json(results);
  });
});


// Ruta para obtener TODOS los productos (habilitados e inhabilitados, para el administrador)
app.get('/api/productos/all', (req, res) => {
  const query = 'SELECT * FROM productos';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener todos los productos');
      return;
    }
    res.json(results);
  });
});




// Ruta para añadir productos
app.post('/api/productos/add', (req, res) => {
  const { nombre, descripcion, precio, imagen, category } = req.body;
  
  if (!nombre || !descripcion || !precio || !imagen || !category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const query = 'INSERT INTO productos (nombre, descripcion, precio, imagen, category) VALUES (?, ?, ?, ?, ?)';
  const values = [nombre, descripcion, precio, imagen, category];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al insertar el producto:', err);
      return res.status(500).json({ error: 'Error al guardar el producto en la base de datos.' });
    }
    res.status(201).json({ message: 'Producto añadido con éxito.', id: result.insertId });
  });
});

// Ruta para obtener productos por categoría (solo los habilitados)
app.get('/api/productos/:category', (req, res) => {
  const category = req.params.category;
  const query = 'SELECT * FROM productos WHERE category = ? AND status = 1';
  db.query(query, [category], (err, results) => {
    if (err) {
      console.error('Error al obtener los productos por categoría:', err);
      res.status(500).send('Error al obtener los productos por categoría');
      return;
    }
    res.json(results);
  });
});

app.put('/api/productos/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status === undefined) {
    return res.status(400).json({ error: 'El estado es obligatorio.' });
  }

  const query = 'UPDATE productos SET status = ? WHERE id = ?';
  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar el estado del producto:', err);
      return res.status(500).json({ error: 'Error al actualizar el estado en la base de datos.' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.status(200).json({ message: 'Estado del producto actualizado con éxito.' });
  });
});


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});