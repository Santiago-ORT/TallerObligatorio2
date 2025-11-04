const express = require('express');

const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('¡Hola desde el Backend de Node.js y Express!');
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log('Presiona CTRL+C para detenerlo');
});