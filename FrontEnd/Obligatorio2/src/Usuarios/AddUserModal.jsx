import React, { useState } from "react";
import "./AddUserModal.css";

const AddUserModal = ({ isOpen, onClose, onAddUser }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("Usuario");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim()) {
      alert("Completa todos los campos.");
      return;
    }

    onAddUser({ nombre, email, rol });
    onClose();
    setNombre("");
    setEmail("");
    setRol("Usuario");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Agregar Usuario</h3>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>Nombre:</label>
          <input className="input"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label>Email:</label>
          <input className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Rol:</label>
          <select className="input" value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="Usuario">Usuario</option>
            <option value="Admin">Admin</option>
          </select>

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

export default AddUserModal;
