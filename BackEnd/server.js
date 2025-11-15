const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;
const multer = require("multer");
const path = require("path");

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


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

app.post("/subirproductoimagen", upload.single("imagen"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se subió la imagen" });
  res.json({ imagenURL: `/img/${req.file.filename}` });
});


app.post("/agregarproducto", (req, res) => {
  const { nombre, precio, descuento, categoria, imagen } = req.body;
  if (!nombre || !precio || !categoria)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  const sql = `INSERT INTO productos (nombre, precio, descuento, categoria, imagen) VALUES (?, ?, ?, ?, ?)`;
  pool.query(sql, [nombre, precio, descuento || 0, categoria, imagen || ""], (err, results) => {
    if (err) return res.status(500).json({ error: "Error agregando producto" });

    // Devolvemos el producto con ID y fecha
    pool.query(`SELECT * FROM productos WHERE id = ?`, [results.insertId], (err2, rows) => {
      if (err2) return res.status(500).json({ error: "Error obteniendo producto" });
      res.json(rows[0]);
    });
  });
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

app.post('/registro', (req, res) => {
  const { usuario, email, password, nombre, apellido, ci } = req.body;

  if (!usuario || !email || !password || !nombre || !apellido || !ci) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

 
  const checkSql = "SELECT Email FROM Usuarios WHERE Email = ? LIMIT 1";

  pool.query(checkSql, [email], (err, results) => {
    if (err) {
      console.error("Error verificando email:", err);
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: "El email ya está registrado." });
    }

    // Insertar usuario nuevo
    const insertSql = `
      INSERT INTO Usuarios (User, Pass, Email, Rol, Nombre, Apellido, CI)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Por defecto, el rol puede ser "Cliente"
    const rol = "Cliente";

    pool.query(
      insertSql,
      [usuario, password, email, rol, nombre, apellido, ci],
      (err, result) => {
        if (err) {
          console.error("Error registrando usuario:", err);
          return res.status(500).json({ error: "Error al registrar usuario." });
        }

        res.json({
          mensaje: "Usuario registrado con éxito",
          usuario: {
            id: result.insertId,
            usuario,
            nombre,
            apellido,
            email,
            rol,
            ci
          }
        });
      }
    );
  });
});
app.delete("/deleteusuario", (req, res) => {
  const { ids } = req.body; // ids es un array de idUsuarios
  if (!ids || ids.length === 0) return res.status(400).json({ error: "No se enviaron IDs" });

  const sql = `DELETE FROM Usuarios WHERE idUsuarios IN (?)`;
  pool.query(sql, [ids], (err, results) => {
    if (err) return res.status(500).json({ error: "Error eliminando usuarios" });
    res.json({ message: `${results.affectedRows} usuario(s) eliminados` });
  });
});
app.get("/listaproductos", (req, res) => {
  const sql = `SELECT id, nombre, precio, descuento, categoria, imagen, fecha_creacion, stock FROM productos`;
  pool.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Error trayendo productos" });

    res.json(results);
  });
});

app.delete("/deleteproductos", (req, res) => {
  const { ids } = req.body; // ids es un array de id de productos
  if (!ids || ids.length === 0) return res.status(400).json({ error: "No se enviaron IDs" });

  const sql = `DELETE FROM productos WHERE id IN (?)`;
  pool.query(sql, [ids], (err, results) => {
    if (err) return res.status(500).json({ error: "Error eliminando productos" });

    res.json({ message: `${results.affectedRows} producto(s) eliminados` });
  });
});
app.put("/editarproducto/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, precio, descuento, categoria, stock } = req.body;

  if (!nombre || !precio || !categoria) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const sql = `
    UPDATE productos
    SET nombre = ?, precio = ?, descuento = ?, categoria = ?, stock = ?
    WHERE id = ?
  `;

  pool.query(
    sql,
    [nombre, precio, descuento || 0, categoria || "", stock, id],
    (err, results) => {
      if (err) {
        console.error("Error actualizando producto:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      res.json({ message: "Producto actualizado correctamente" });
    }
  );
});
app.put("/editarUsuario/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol } = req.body;

  const sql = "UPDATE Usuarios SET Nombre=?, Email=?, Rol=? WHERE idUsuarios=?";
  pool.query(sql, [nombre, email, rol, id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al actualizar usuario" });
    res.json({ message: "Usuario actualizado correctamente" });
  });
});
app.get("/consultarusuario/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID de usuario requerido." });
  }

  const sql = `
    SELECT 
      idUsuarios AS id,
      User AS usuario,
      Nombre AS nombre,
      Apellido AS apellido,
      Email AS email,
      Rol AS rol,
      CI AS ci
    FROM Usuarios 
    WHERE idUsuarios = ? 
    LIMIT 1
  `;

  pool.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error consultando usuario:", err);
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    res.json(results[0]);
  });
});
app.get("/listausuarios", (req, res) => {
  const sql = `
    SELECT 
      idUsuarios AS id,
      User AS usuario,
      Nombre AS nombre,
      Apellido AS apellido,
      Email AS email,
      Rol AS rol,
      CI AS ci
    FROM Usuarios
    ORDER BY idUsuarios ASC
  `;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Error trayendo usuarios:", err);
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    res.json(results);
  });
});
app.get("/listacompras", (req, res) => {
  const sql = `
    SELECT 
      c.idCompra,
      c.IdProducto,
      c.Cantidad,
      p.nombre AS nombreProducto,
      c.FechaCompra,
      DATE_FORMAT(c.FechaCompra, '%Y-%m-%d %H:%i:%s') AS FechaCompraFormateada,
      c.EstadoCompra,
      c.Envio,
      u.idUsuarios AS idCliente,
      u.User AS usuario,
      u.Nombre AS nombre,
      u.Apellido AS apellido,
      u.Email AS email
    FROM Compras c
    JOIN Usuarios u ON c.IdCliente = u.idUsuarios
    JOIN Productos p ON FIND_IN_SET(p.id, c.IdProducto) > 0
    ORDER BY c.idCompra ASC
  `;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Error trayendo compras:", err);
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    // Para concatenar correctamente nombres de productos si hay varios por compra
    const comprasMap = {};
    results.forEach((row) => {
      if (!comprasMap[row.idCompra]) {
        comprasMap[row.idCompra] = {
          ...row,
          IdProducto: [row.nombreProducto], // inicializamos con el primer producto
        };
      } else {
        comprasMap[row.idCompra].IdProducto.push(row.nombreProducto);
      }
    });

    const comprasFinal = Object.values(comprasMap).map((compra) => ({
      ...compra,
      IdProducto: compra.IdProducto.join(", "), // unimos nombres de productos por coma
      FechaCompra: compra.FechaCompraFormateada, // usamos fecha formateada
      FechaCompraFormateada: undefined, // eliminamos campo temporal
      nombreProducto: undefined, // eliminamos campo temporal
    }));

    res.json(comprasFinal);
  });
});


app.post("/crearcompra", (req, res) => {
  console.log("Llega POST /crearcompra");
  console.log("Body recibido:", req.body);

  const { IdProducto, FechaCompra, EstadoCompra, IdCliente, Envio, Cantidad } = req.body;

  if (!IdProducto || !FechaCompra || !EstadoCompra || !IdCliente || !Envio) {
    console.log("Faltan datos:", { IdProducto, FechaCompra, EstadoCompra, IdCliente, Envio });
    return res.status(400).json({ error: "Faltan datos de la compra" });
  }

  const sql = `INSERT INTO Compras 
    (IdProducto, FechaCompra, EstadoCompra, IdCliente, Envio, Cantidad ) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  console.log("Ejecutando SQL:", sql);
  console.log("Con valores:", [IdProducto, FechaCompra, EstadoCompra, IdCliente, Envio]);

  pool.query(sql, [IdProducto, FechaCompra, EstadoCompra, IdCliente, Envio, Cantidad], (err, result) => {
    if (err) {
      console.error("Error al crear la compra en la BD:", err);
      return res.status(500).json({ error: "Error al crear la compra", detalles: err });
    }
    console.log("Compra creada correctamente, insertId:", result.insertId);
    res.json({ message: "Compra registrada correctamente", idCompra: result.insertId });
  });
});

app.get("/usuarios", (req, res) => {
  const sql = `
    SELECT 
      idUsuarios AS id,
      User AS usuario,
      Nombre AS nombre,
      Apellido AS apellido,
      Email AS email,
      Rol AS rol,
      CI AS ci
    FROM Usuarios
    ORDER BY idUsuarios ASC
  `;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Error trayendo usuarios:", err);
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    res.json(results);
  });
});

// Actualizar el estado de una compra
app.put("/editarcompra/:id", (req, res) => {
  const { id } = req.params;
  const { EstadoCompra } = req.body;

  if (!EstadoCompra) {
    return res.status(400).json({ error: "Falta el nuevo estado de la compra" });
  }

  const sql = `
    UPDATE Compras
    SET EstadoCompra = ?
    WHERE idCompra = ?
  `;

  pool.query(sql, [EstadoCompra, id], (err, result) => {
    if (err) {
      console.error("Error actualizando estado de compra:", err);
      return res.status(500).json({ error: "Error al actualizar la compra" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Compra no encontrada" });
    }

    res.json({ message: `Compra ${id} actualizada correctamente` });
  });
});
app.get('/', (req, res) => {
  res.send('¡Server Corriendo!');
});


app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log('Presiona CTRL+C para detenerlo');
});