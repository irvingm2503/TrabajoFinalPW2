const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.json());
app.use(express.static('public'));

// Ruta para obtener todos los productos
app.get('/api/items', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los productos:', error.message);
    res.status(500).send({ message: 'Error al obtener los productos', error: error.message });
  }
});

// Ruta para crear un nuevo producto
app.post('/api/items', async (req, res) => {
  const { nombre, precio, unidades, caracteristicas, descripcion, fechaPublicacion, favoritos } = req.body;

  // Validar que los datos necesarios estén presentes
  if (!nombre || !precio || !unidades || !caracteristicas || !descripcion || !fechaPublicacion || favoritos === undefined) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    // Insertar los datos en la base de datos
    const [result] = await db.query(
      'INSERT INTO productos (NOMBRE, PRECIO, UNIDADES_DISPONIBLES, CARACTERISTICAS_JS, DESCRIPCION, FECHAPUBLICACION, FAVORITOS) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [nombre, precio, unidades, caracteristicas, descripcion, fechaPublicacion, favoritos]
    );

    // Responder con los datos del nuevo producto creado
    res.status(201).json({
      id: result.insertId, // ID generado automáticamente
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

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
