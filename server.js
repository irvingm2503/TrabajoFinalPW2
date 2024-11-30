const express = require('express');
const bodyParser = require('body-parser');
const supabase = require('./db');

const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.json());
app.use(express.static('public'));

// Ruta para obtener todos los productos
app.get('/api/items', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*');

    if (error) {
      throw error;
    }

    console.log('Datos recuperados:', data);

    res.json(data);
  } catch (error) {
    console.error('Error al obtener los productos:', error.message);
    res.status(500).send({ message: 'Error al obtener los productos', error: error.message });
  }
});

// Ruta para obtener un producto por ID
app.get('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).send({ message: 'Producto no encontrado' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error al obtener el producto:', error.message);
    res.status(500).send({ message: 'Error al obtener el producto', error: error.message });
  }
});

// Ruta para crear un nuevo producto
app.post('/api/items', async (req, res) => {
  const { vendedor, nombre, precio, unidades_disponibles, caracteristicas_js, descripcion, fechapublicacion, favoritos } = req.body;

  if (!vendedor || !nombre || !precio || !unidades_disponibles || !caracteristicas_js || !descripcion || !fechapublicacion || favoritos === undefined) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const { data, error } = await supabase
      .from('productos')
      .insert([
        { vendedor, nombre, precio, unidades_disponibles, caracteristicas_js, descripcion, fechapublicacion, favoritos }
      ]);

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error en la consulta SQL:', error.message);
    res.status(500).send({ message: 'Error al insertar el producto', error: error.message });
  }
});

// Ruta para eliminar un producto
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      res.status(404).send({ message: 'Producto no encontrado' });
    } else {
      res.status(200).send({ message: 'Producto eliminado exitosamente' });
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error.message);
    res.status(500).send({ message: 'Error al eliminar el producto', error: error.message });
  }
});

// Ruta para actualizar un producto por ID
app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, unidades_disponibles, caracteristicas_js, descripcion, fechapublicacion, favoritos } = req.body;

  try {
    const { data, error } = await supabase
      .from('productos')
      .update({ nombre, precio, unidades_disponibles, caracteristicas_js, descripcion, fechapublicacion, favoritos })
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.status(200).send({ message: 'Producto actualizado exitosamente', data });
  } catch (error) {
    console.error('Error al actualizar el producto:', error.message);
    res.status(500).send({ message: 'Error al actualizar el producto', error: error.message });
  }
});

// Ruta para iniciar sesión
app.post('/api/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('correo', correo);

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      res.status(404).send({ message: 'Correo no encontrado' });
    } else {
      const usuario = data[0];
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

  if (false) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const { data, error } = await supabase
      .from('usuario')
      .insert([
        { nombres, apellidos, correo, contrasena }
      ]);

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error en la consulta SQL:', error.message);
    res.status(500).send({ message: 'Error al registrar el usuario', error: error.message });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
