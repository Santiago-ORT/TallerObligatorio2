import React, { useState, useEffect } from "react";
import "./EditUserModal.css"; 

const EditUserModal = ({ isOpen, onClose, userData, onSave }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("Usuario");

  useEffect(() => {
    if (userData) {
      setNombre(userData.nombre);
      setEmail(userData.email);
      setRol(userData.rol);
    }
  }, [userData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim()) {
      alert("Completa todos los campos.");
      return;
    }

    onSave({
      id: userData.id,
      nombre,
      email,
      rol,
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

          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Rol:</label>
          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="Cliente">Cliente</option>
            <option value="Administrador">Administrador</option>
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

export default EditUserModal;
