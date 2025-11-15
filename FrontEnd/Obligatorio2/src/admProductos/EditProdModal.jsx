import React, { useState, useEffect } from "react";
import "./EditProdModal.css";

const EditProdModal = ({ isOpen, onClose, prodData, onSave }) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [stock, setStock] = useState(0);
  const [categoria, setCategoria] = useState("-");

  useEffect(() => {
    if (prodData) {
      setNombre(prodData.nombre);
      setPrecio(prodData.precio);
      setDescuento(prodData.descuento);
      setCategoria(prodData.categoria);
      setStock(prodData.stock);
    }
  }, [prodData]);

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!nombre.trim() || !precio || !categoria.trim()) {
    alert("Completa todos los campos obligatorios.");
    return;
  }

  // Creamos el objeto de producto para enviar al onSave
  onSave({
    id: prodData.id,
    nombre: nombre.trim(),
    precio: parseFloat(precio),
    stock: parseFloat(stock),
    descuento: parseFloat(descuento) || 0, // si está vacío ponemos 0
    categoria,
  });

  onClose();
};


  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Editar Usuario</h3>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label>Precio:</label>
          <input
            type="text"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
          <label>Descuento:</label>
          <input
            type="text"
            value={descuento}
            onChange={(e) => setDescuento(e.target.value)}
          />
          <label>Stock:</label>
          <input
            type="text"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <label>Categoría:</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="Guitarras">Guitarras</option>
            <option value="Bajos">Bajos</option>
            <option value="Baterías">Baterías</option>
            <option value="Teclados">Teclados</option>
            <option value="Accesorios">Accesorios</option>
          </select>

          <div className="modal-buttons">
            <button type="submit" className="confirm">
              Guardar Cambios
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

export default EditProdModal;
