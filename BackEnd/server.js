const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());
app.use('/img', express.static(__dirname + '/public/img'));

const pool = mysql.createPool({
  host: 'localhost',       
  user: 'root',            
  password: 'root',            
  database: 'obligatorio',      
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar con MySQL:', err.message);
  } else {
    console.log('Conectado a la base de datos MySQL');
    connection.release();
  }
});


app.get('/productos', (req, res) => {
  const sql = 'SELECT * FROM productos';

  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      return res.status(500).json({ error: 'Error al obtener productos' });
    }
    res.json(results);
  });
});


app.get('/', (req, res) => {
  res.send('¡Server Corriendo!');
});


app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log('Presiona CTRL+C para detenerlo');
});