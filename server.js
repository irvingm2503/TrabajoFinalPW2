const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.json());
app.use(express.static('public'));

// Ruta para obtener productos de un usuario específico
app.get('/api/items', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).send({ message: 'Faltan parámetros requeridos' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM productos WHERE vendedor = ?', [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los productos:', error.message);
    res.status(500).send({ message: 'Error al obtener los productos', error: error.message });
  }
});

// Ruta para crear un nuevo producto
app.post('/api/items', async (req, res) => {
  const { vendedor, nombre, precio, unidades, caracteristicas, descripcion, fechaPublicacion, favoritos } = req.body;

  // Validar que los datos necesarios estén presentes
  if (!vendedor || !nombre || !precio || !unidades || !caracteristicas || !descripcion || !fechaPublicacion || favoritos === undefined) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    // Insertar los datos en la base de datos
    const [result] = await db.query(
      'INSERT INTO productos (vendedor, NOMBRE, PRECIO, UNIDADES_DISPONIBLES, CARACTERISTICAS_JS, DESCRIPCION, FECHAPUBLICACION, FAVORITOS) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
      [vendedor, nombre, precio, unidades, caracteristicas, descripcion, fechaPublicacion, favoritos]
    );

    // Responder con los datos del nuevo producto creado
    res.status(201).json({
      id: result.insertId, // ID generado automáticamente
      vendedor,
      nombre,
      precio,
      unidades,
      caracteristicas,
      descripcion,
      fechaPublicacion,
      favoritos
    });
  } catch (error) {
    console.error('Error en la consulta SQL:', error.message);
    res.status(500).send({ message: 'Error al insertar el producto', error: error.message });
  }
});

// Ruta para eliminar un producto
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM productos WHERE ID = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(404).send({ message: 'Producto no encontrado' });
    } else {
      res.status(200).send({ message: 'Producto eliminado exitosamente' });
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error.message);
    res.status(500).send({ message: 'Error al eliminar el producto', error: error.message });
  }
});

// Ruta para iniciar sesión
app.post('/api/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
    
    if (rows.length === 0) {
      res.status(404).send({ message: 'Correo no encontrado' });
    } else {
      const usuario = rows[0];
      if (usuario.contrasena === contrasena) {
        res.status(200).send({ message: 'Inicio de sesión exitoso', user: usuario });
      } else {
        res.status(401).send({ message: 'Contraseña incorrecta' });
      }
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    res.status(500).send({ message: 'Error al iniciar sesión', error: error.message });
  }
});

// Ruta para registrar un nuevo usuario
app.post('/api/register', async (req, res) => {
  const { nombres, apellidos, correo, contrasena } = req.body;

  // Validar que los datos necesarios estén presentes
  if (!nombres || !apellidos || !correo || !contrasena) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    // Insertar los datos en la base de datos
    const [result] = await db.query(
      'INSERT INTO usuario (nombres, apellidos, correo, contrasena) VALUES (?, ?, ?, ?)',
      [nombres, apellidos, correo, contrasena]
    );

    // Responder con los datos del nuevo usuario creado
    res.status(201).json({
      id: result.insertId, // ID generado automáticamente
      nombres,
      apellidos,
      correo
    });
  } catch (error) {
    console.error('Error en la consulta SQL:', error.message);
    res.status(500).send({ message: 'Error al registrar el usuario', error: error.message });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
