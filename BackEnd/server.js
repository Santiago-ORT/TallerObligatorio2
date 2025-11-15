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

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son requeridos." });
  }

  const sql = "SELECT * FROM Usuarios WHERE Email = ? AND Pass = ? LIMIT 1";

  pool.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Error en login:", err);
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    const user = results[0];

    res.json({
      mensaje: "Login exitoso",
      usuario: {
        id: user.idUsuarios,
        nombre: user.Nombre,
        apellido: user.Apellido,
        email: user.Email,
        rol: user.Rol
      }
    });
  });
});


app.get('/', (req, res) => {
  res.send('¡Server Corriendo!');
});


app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log('Presiona CTRL+C para detenerlo');
});