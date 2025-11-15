import React, { useState, useMemo, useEffect } from "react";
import "./AdmUsuarios.css";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import Notificacion from "../Notificacion/Notificacion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdmUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const usuarioLS = localStorage.getItem("usuario");
    console.log("Usuario en localStorage:", usuarioLS);

    if (!usuarioLS) {
      console.log("No hay usuario en localStorage, redirigiendo a /");
      return navigate("/");
    }

    const usuarioObj = JSON.parse(usuarioLS);
    console.log("Usuario parseado del localStorage:", usuarioObj);

    axios
      .get(`http://localhost:3000/consultarusuario/${usuarioObj.id}`)
      .then((res) => {
        console.log("Respuesta del backend:", res);
        const usuarioDB = res.data;
        console.log("Usuario obtenido del backend:", usuarioDB);

        // Validación solo por ID
        if (usuarioDB.id === usuarioObj.id) {
          console.log("ID coincide, setUsuarioActual");
          setUsuarioActual(usuarioDB);

          // Redirigir si no es administrador
          if (usuarioDB.rol !== "Administrador") {
            console.log("No es Administrador, redirigiendo a /");
            navigate("/");
          }
        } else {
          console.log("ID no coincide, redirigiendo a /");
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Error en Axios:", err);
        console.log("Detalles del error Axios:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          headers: err.response?.headers,
          config: err.config,
        });
        navigate("/error");
      });
  }, [navigate]);

  // 🔹 Traer todos los usuarios desde backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/listausuarios")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error trayendo usuarios:", err));
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
  };
  const handleOpenEdit = (user) => {
    setUserToEdit(user);
    setOpenEditModal(true);
  };

  const handleSaveEditedUser = (editedUser) => {
    // Mandar los cambios al backend
    axios
      .put(`http://localhost:3000/editarUsuario/${editedUser.id}`, editedUser)
      .then((res) => {
        console.log("Usuario actualizado en la BD:", res.data);

        // Actualizar el estado local solo si la BD respondió bien
        const updatedUsers = users.map((u) =>
          u.id === editedUser.id ? editedUser : u
        );
        setUsers(updatedUsers);

        triggerToast(`Usuario "${editedUser.nombre}" actualizado.`);
      })
      .catch((err) => {
        console.error("Error actualizando usuario en la BD:", err);
        alert("No se pudo actualizar el usuario en la base de datos.");
      });
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleSelectUser = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedUserIds.length === 0) return;

    // Llamada al backend
    axios
      .delete("http://localhost:3000/deleteusuario", {
        data: { ids: selectedUserIds },
      })
      .then((res) => {
        console.log("Usuarios eliminados en BD:", res.data);

        // Actualizar estado local
        const newUsers = users.filter(
          (user) => !selectedUserIds.includes(user.id)
        );
        setUsers(newUsers);
        setSelectedUserIds([]);
        triggerToast(`Se eliminaron ${selectedUserIds.length} usuario(s).`);
      })
      .catch((err) => {
        console.error("Error eliminando usuarios en BD:", err);
        alert("No se pudieron eliminar los usuarios.");
      });
  };

  const handleAddUserFromModal = (newUserData) => {
    const newId =
      users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

    const newUser = {
      id: newId,
      ...newUserData,
    };

    setUsers([...users, newUser]);
    triggerToast(`Usuario "${newUser.nombre}" agregado.`);
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

      <h2 className="admin-header">Administración de Usuarios</h2>

      <div className="admin-controls">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="action-buttons">
          <button
            className="delete-button"
            onClick={handleDeleteSelected}
            disabled={selectedUserIds.length === 0}
          >
            🗑️ Eliminar Seleccionados ({selectedUserIds.length})
          </button>
        </div>
      </div>

      <AddUserModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onAddUser={handleAddUserFromModal}
      />
      <EditUserModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        userData={userToEdit}
        onSave={handleSaveEditedUser}
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
          <p className="no-results">
            No se encontraron usuarios que coincidan con la búsqueda.
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th></th>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={
                      selectedUserIds.includes(user.id) ? "selected-row" : ""
                    }
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </td>
                    <td>{user.id}</td>
                    <td>{user.nombre}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-tag ${user.rol.toLowerCase()}`}>
                        {user.rol}
                      </span>
                    </td>
                    <td>
                      <button
                        className="edit-action"
                        onClick={() => handleOpenEdit(user)}
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

export default AdmUsuarios;
