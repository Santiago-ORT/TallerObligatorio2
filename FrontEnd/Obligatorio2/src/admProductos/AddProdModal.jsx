import React, { useState } from "react";
import "./AddProdModal.css";
import axios from "axios";

const categoriasDisponibles = [
  "Guitarras",
  "Bajos",
  "Baterías",
  "Teclados",
  "Accesorios",
];

const AddProdModal = ({ isOpen, onClose, onAddUser }) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descuento, setDescuento] = useState("");
  const [categoria, setCategoria] = useState(categoriasDisponibles[0]);
  const [imagenFile, setImagenFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !precio.trim() || !categoria.trim()) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    try {
      let imagenURL = "";

      // Si seleccionó una imagen, la subimos al backend
      if (imagenFile) {
        const formData = new FormData();
        formData.append("imagen", imagenFile);

        const res = await axios.post(
          "http://localhost:3000/subirproductoimagen",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        imagenURL = res.data.imagenURL; // el backend devuelve la URL
      }

      const nuevoProducto = {
        nombre,
        precio: parseFloat(precio),
        descuento: descuento ? parseFloat(descuento) : 0,
        categoria,
        imagen: imagenURL,
      };

      // Guardamos en la BD
      const response = await axios.post(
        "http://localhost:3000/agregarproducto",
        nuevoProducto
      );

      onAddUser(response.data); // devuelve el producto con ID y fecha
      onClose();

      // Limpiamos el formulario
      setNombre("");
      setPrecio("");
      setDescuento("");
      setCategoria(categoriasDisponibles[0]);
      setImagenFile(null);
    } catch (err) {
      console.error("Error agregando producto:", err);
      alert("No se pudo agregar el producto.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Agregar Producto</h3>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>Nombre:</label>
          <input
            className="input"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label>Precio:</label>
          <input
            className="input"
            type="number"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />

          <label>Descuento:</label>
          <input
            className="input"
            type="number"
            step="0.01"
            value={descuento}
            onChange={(e) => setDescuento(e.target.value)}
          />

          <label>Categoría:</label>
          <select
            className="input"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {categoriasDisponibles.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label>Imagen:</label>
          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={(e) => setImagenFile(e.target.files[0])}
          />

          <div className="modal-buttons">
            <button type="submit" className="confirm">
              Agregar
            </button>
            <button type="button" className="cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProdModal;