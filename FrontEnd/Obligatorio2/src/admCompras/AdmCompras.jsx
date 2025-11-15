import React, { useState, useEffect } from "react";
import "./AdmCompras.css";
import Notificacion from "../Notificacion/Notificacion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdmCompras = () => {
  const [compras, setCompras] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  const estadosPosibles = ["Pendiente", "Entregado", "Cancelado"];

  // Validar usuario administrador
  useEffect(() => {
    const usuarioLS = localStorage.getItem("usuario");
    if (!usuarioLS) return navigate("/");

    const usuarioObj = JSON.parse(usuarioLS);
    axios
      .get(`http://localhost:3000/consultarusuario/${usuarioObj.id}`)
      .then((res) => {
        const usuarioDB = res.data;
        if (usuarioDB.rol !== "Administrador") navigate("/");
      })
      .catch(() => navigate("/error"));
  }, [navigate]);

  // Traer todas las compras con info de usuario
  useEffect(() => {
    axios
      .get("http://localhost:3000/listacompras")
      .then((res) => setCompras(res.data))
      .catch((err) => console.error("Error trayendo compras:", err));
  }, []);

  const filteredCompras = compras.filter(
    (c) =>
      c.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.idCompra?.toString().includes(searchTerm) ||
      c.EstadoCompra?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Cambiar el estado de una compra
  const handleEstadoChange = (idCompra, nuevoEstado) => {
    axios
      .put(`http://localhost:3000/editarcompra/${idCompra}`, { EstadoCompra: nuevoEstado })
      .then(() => {
        setCompras(
          compras.map((c) =>
            c.idCompra === idCompra ? { ...c, EstadoCompra: nuevoEstado } : c
          )
        );
        triggerToast(`Compra ${idCompra} actualizada a "${nuevoEstado}"`);
      })
      .catch((err) => {
        console.error("Error actualizando estado de compra:", err);
        alert("No se pudo actualizar el estado de la compra.");
      });
  };

  return (
    <div className="admin-container">
      <button
        className="volver-button"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "8px 12px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        Volver
      </button>

      <h2 className="admin-header">Administración de Compras</h2>

      <div className="admin-controls">
        <input
          type="text"
          placeholder="Buscar "
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showToast && (
        <Notificacion
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="user-list">
        {filteredCompras.length === 0 ? (
          <p className="no-results">No se encontraron compras.</p>
        ) : (
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID Compra</th>
                  <th>Productos</th>
                  <th>Cantidad</th>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Envío</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompras.map((compra) => (
                  <tr
                    key={compra.idCompra}
                    className={selectedIds.includes(compra.idCompra) ? "selected-row" : ""}
                  >
                    <td>{compra.idCompra}</td>
                    <td>{compra.IdProducto}</td>
                    <td>{compra.Cantidad}</td>
                    <td>{compra.nombre} {compra.apellido}</td>
                    <td>{compra.email}</td>
                    <td>{compra.FechaCompra}</td>
                    <td>
                      <select
                        value={compra.EstadoCompra}
                        onChange={(e) => handleEstadoChange(compra.idCompra, e.target.value)}
                      >
                        {estadosPosibles.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{compra.Envio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmCompras;
