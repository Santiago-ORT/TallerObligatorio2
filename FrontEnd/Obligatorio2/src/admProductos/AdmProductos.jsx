import React, { useState, useMemo, useEffect } from "react";
import "./AdmProductos.css";
import AddProdModal from "./AddProdModal";
import EditProdModal from "./EditProdModal";
import Notificacion from "../Notificacion/Notificacion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdmProductos = () => {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  // Validar usuario en localStorage
  useEffect(() => {
    const usuarioLS = localStorage.getItem("usuario");
    if (!usuarioLS) return navigate("/");

    const usuarioObj = JSON.parse(usuarioLS);

    axios
      .get(`http://localhost:3000/consultarusuario/${usuarioObj.id}`)
      .then((res) => {
        const usuarioDB = res.data;
        setUsuarioActual(usuarioDB);
        if (usuarioDB.rol !== "Administrador") navigate("/");
      })
      .catch(() => navigate("/error"));
  }, [navigate]);

  // Traer productos
  useEffect(() => {
    axios
      .get("http://localhost:3000/listaproductos")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error trayendo productos:", err));
  }, []);

  const filteredUsers = useMemo(() => {
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productos, searchTerm]);

  const handleSelectUser = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedUserIds.length === 0) return;

    axios
      .delete("http://localhost:3000/deleteproductos", {
        data: { ids: selectedUserIds },
      })
      .then((res) => {
        setProductos(productos.filter((p) => !selectedUserIds.includes(p.id)));
        setSelectedUserIds([]);
        triggerToast(`${res.data.message}`);
      })
      .catch((err) => {
        console.error("Error eliminando productos:", err);
        alert("No se pudieron eliminar los productos.");
      });
  };

  const handleOpenEdit = (producto) => {
    setUserToEdit(producto);
    setOpenEditModal(true);
  };

  const handleSaveEditedProd = (editedProducto) => {
    axios
      .put(
        `http://localhost:3000/editarproducto/${editedProducto.id}`,
        editedProducto
      )
      .then(() => {
        setProductos(
          productos.map((p) =>
            p.id === editedProducto.id ? editedProducto : p
          )
        );
        triggerToast(`Producto "${editedProducto.nombre}" actualizado.`);
      })
      .catch((err) => {
        console.error("Error actualizando producto:", err);
        alert("No se pudo actualizar el producto en la BD.");
      });
  };

  const handleAddUserFromModal = (newProductoData) => {
    const newId =
      productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1;
    const newProducto = { id: newId, ...newProductoData };
    setProductos([...productos, newProducto]);
    triggerToast(`Producto "${newProducto.nombre}" agregado.`);
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

      <h2 className="admin-header">Administración de Productos</h2>

      <div className="admin-controls">
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="action-buttons">
          <button className="add-button" onClick={() => setOpenModal(true)}>
            Agregar Producto
          </button>
          <button
            className="delete-button"
            onClick={handleDeleteSelected}
            disabled={selectedUserIds.length === 0}
          >
            🗑️ Eliminar Seleccionados ({selectedUserIds.length})
          </button>
        </div>
      </div>

      <AddProdModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onAddUser={handleAddUserFromModal}
      />
      <EditProdModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        prodData={userToEdit}
        onSave={handleSaveEditedProd}
      />
      {showToast && (
        <Notificacion
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="user-list">
        {filteredUsers.length === 0 ? (
          <p className="no-results">No se encontraron productos.</p>
        ) : (
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th></th>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Descuento</th>
                   <th>Stock</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((producto) => (
                  <tr
                    key={producto.id}
                    className={
                      selectedUserIds.includes(producto.id)
                        ? "selected-row"
                        : ""
                    }
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(producto.id)}
                        onChange={() => handleSelectUser(producto.id)}
                      />
                    </td>
                    <td>{producto.id}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.precio}</td>
                    <td>{producto.descuento}</td>
                    <td>{producto.stock}</td>
                    <td>{producto.categoria}</td>
                    <td>
                      <button
                        className="edit-action"
                        onClick={() => handleOpenEdit(producto)}
                      >
                        Editar
                      </button>
                    </td>
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

export default AdmProductos;
