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


// Nueva ruta para obtener productos por categoría
app.get('/api/productos/:category', (req, res) => {
  const category = req.params.category; // Obtiene el parámetro de la URL
  const query = 'SELECT * FROM productos WHERE category = ?';
  db.query(query, [category], (err, results) => {
    if (err) {
      console.error('Error al obtener los productos por categoría:', err);
      res.status(500).send('Error al obtener los productos por categoría');
      return;
    }
    res.json(results);
  });
});


// Rutas de ejemplo (API)
app.get('/api/productos', (req, res) => {
  const query = 'SELECT * FROM productos';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener los productos');
      return;
    }
    res.json(results);
  });
});

app.post('/api/user/role', (req, res) => {
  const { uid } = req.body;
  if (!uid) {
    return res.status(400).json({ error: 'UID is required' });
  }

  const query = 'SELECT role, status FROM users WHERE id = ?';
  db.query(query, [uid], (err, results) => {
    if (err) {
      console.error('Error al buscar el usuario:', err);
      return res.status(500).send('Error en la base de datos');
    }
    
    if (results.length === 0) {
      // Si el usuario no existe en la base de datos, lo tratamos como un nuevo cliente
      const insertQuery = 'INSERT INTO users (id, email, role, status) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [uid, 'newuser@example.com', 'Cliente', 1], (insertErr) => {
        if (insertErr) {
          console.error('Error al insertar nuevo usuario:', insertErr);
          return res.status(500).send('Error al registrar nuevo usuario');
        }
        res.json({ role: 'Cliente', status: 1 });
      });
    } else {
      res.json(results[0]);
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});