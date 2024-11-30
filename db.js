const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Cambia esto según tus credenciales
  password: '', // Cambia esto según tus credenciales
  database: 'ventas'
});

console.log("Conexión a la base de datos establecida");
module.exports = pool.promise();