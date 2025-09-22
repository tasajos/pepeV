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

// Ruta para obtener todos los valores de configuración
app.get('/api/config', (req, res) => {
  const query = 'SELECT * FROM configuracion';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener la configuración:', err);
      return res.status(500).json({ error: 'Error al obtener la configuración de la base de datos.' });
    }
    const config = results.reduce((obj, item) => {
      obj[item.setting_name] = item.setting_value;
      return obj;
    }, {});
    res.json(config);
  });
});





// Actualiza el endpoint para crear pedidos
app.post('/api/pedidos/create', (req, res) => {
  const { nombre_cliente, telefono, ubicacion_lat, ubicacion_lng, total_pedido, productos } = req.body;

  // 1. Insertar en la tabla pedidos_ventas
  const pedidoQuery = 'INSERT INTO pedidos_ventas (nombre_cliente, telefono, ubicacion_lat, ubicacion_lng, total_pedido) VALUES (?, ?, ?, ?, ?)';
  db.query(pedidoQuery, [nombre_cliente, telefono, ubicacion_lat, ubicacion_lng, total_pedido], (err, result) => {
    if (err) {
      console.error('Error al crear el pedido:', err);
      return res.status(500).json({ error: 'Error al crear el pedido.' });
    }

    const pedidoId = result.insertId;

    // 2. Insertar cada producto en la tabla detalles_pedido y actualizar el stock
    const detallesQuery = 'INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES ?';
    const detallesValues = productos.map(item => [pedidoId, item.id, item.quantity, item.precio_venta]);

    db.query(detallesQuery, [detallesValues], (err) => {
      if (err) {
        console.error('Error al insertar detalles del pedido:', err);
        return res.status(500).json({ error: 'Error al insertar los detalles del pedido.' });
      }

      // 3. Reducir la cantidad de cada producto en el inventario
      const updateStockQueries = productos.map(item => {
        return new Promise((resolve, reject) => {
          const updateQuery = 'UPDATE productos SET cantidad = cantidad - ? WHERE id = ?';
          db.query(updateQuery, [item.quantity, item.id], (updateErr) => {
            if (updateErr) return reject(updateErr);
            resolve();
          });
        });
      });

      Promise.all(updateStockQueries)
        .then(() => {
          res.status(201).json({ message: 'Pedido creado y stock actualizado con éxito.', pedidoId });
        })
        .catch(updateErr => {
          console.error('Error al actualizar el stock:', updateErr);
          res.status(500).json({ error: 'Pedido creado, pero error al actualizar el stock.' });
        });
    });
  });
});






// Ruta para actualizar un valor de configuración
app.put('/api/config', (req, res) => {
  const { setting_name, setting_value } = req.body;

  if (!setting_name || setting_value === undefined) {
    return res.status(400).json({ error: 'Faltan parámetros: setting_name y setting_value son obligatorios.' });
  }

  const query = 'INSERT INTO configuracion (setting_name, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?';
  db.query(query, [setting_name, setting_value, setting_value], (err, result) => {
    if (err) {
      console.error('Error al actualizar la configuración:', err);
      return res.status(500).json({ error: 'Error al guardar la configuración en la base de datos.' });
    }
    res.status(200).json({ message: 'Configuración actualizada con éxito.' });
  });
});


// Nuevo endpoint para actualizar todos los precios de los productos
app.post('/api/productos/update-prices', (req, res) => {
  const configQuery = 'SELECT setting_value FROM configuracion WHERE setting_name = "porcentaje_venta"';
  db.query(configQuery, (err, configResult) => {
    if (err || configResult.length === 0) {
      console.error('Error al obtener el porcentaje de venta:', err);
      return res.status(500).json({ error: 'Error al obtener la configuración de la tienda.' });
    }
    
    const porcentaje_venta = parseFloat(configResult[0].setting_value);
    
    const updateQuery = `
      UPDATE productos
      SET precio_venta = precio + (precio * ? / 100)
    `;
    
    db.query(updateQuery, [porcentaje_venta], (err, result) => {
      if (err) {
        console.error('Error al actualizar los precios:', err);
        return res.status(500).json({ error: 'Error al actualizar todos los precios.' });
      }
      res.status(200).json({ message: 'Todos los precios han sido actualizados con éxito.', affectedRows: result.affectedRows });
    });
  });
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

// Ruta para obtener todos los productos (solo los habilitados para la vista del cliente)
// Ahora selecciona el precio_venta
app.get('/api/productos', (req, res) => {
  const query = 'SELECT id, nombre, descripcion, precio_venta, imagen, category, status FROM productos WHERE status = 1';
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




// Ruta para añadir un producto, con cálculo de precio de venta
app.post('/api/productos/add', (req, res) => {
  const { nombre, descripcion, precio, imagen, category } = req.body;
  
  if (!nombre || !descripcion || !precio || !imagen || !category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }
  
  // Paso 1: Obtener el porcentaje de venta de la tabla de configuración
  const configQuery = 'SELECT setting_value FROM configuracion WHERE setting_name = "porcentaje_venta"';
  db.query(configQuery, (err, configResult) => {
    if (err || configResult.length === 0) {
      console.error('Error al obtener el porcentaje de venta:', err);
      return res.status(500).json({ error: 'Error al obtener la configuración de la tienda.' });
    }
    
    const porcentaje_venta = parseFloat(configResult[0].setting_value);
    const precio_venta = parseFloat(precio) + (parseFloat(precio) * porcentaje_venta / 100);
    
    // Paso 2: Insertar el producto con el precio de venta calculado
    const insertQuery = 'INSERT INTO productos (nombre, descripcion, precio, precio_venta, imagen, category) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [nombre, descripcion, precio, precio_venta.toFixed(2), imagen, category];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error al insertar el producto:', err);
        return res.status(500).json({ error: 'Error al guardar el producto en la base de datos.' });
      }
      res.status(201).json({ message: 'Producto añadido con éxito.', id: result.insertId });
    });
  });
});


// Ruta para obtener productos por categoría (solo los habilitados para el cliente)
// Ahora selecciona el precio_venta
app.get('/api/productos/:category', (req, res) => {
  const category = req.params.category;
  const query = 'SELECT id, nombre, descripcion, precio_venta, imagen, category, status FROM productos WHERE category = ? AND status = 1';
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