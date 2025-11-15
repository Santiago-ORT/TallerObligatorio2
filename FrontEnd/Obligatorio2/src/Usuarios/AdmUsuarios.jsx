import React, { useState, useMemo } from 'react';
import './AdmUsuarios.css';
import AddUserModal from './AddUserModal';
import EditUserModal from "./EditUserModal";
import Notificacion from "../Notificacion/Notificacion";


const initialUsers = [
  { id: 1, nombre: 'Ana Gómez', email: 'ana.gomez@example.com', rol: 'Admin' },
  { id: 2, nombre: 'Beto Pérez', email: 'beto.perez@example.com', rol: 'Usuario' },
  { id: 3, nombre: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', rol: 'Usuario' },
  { id: 4, nombre: 'Diana López', email: 'diana.lopez@example.com', rol: 'Admin' },
  { id: 5, nombre: 'Elena Sosa', email: 'elena.sosa@example.com', rol: 'Usuario' },
];


const AdmUsuarios = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const [openModal, setOpenModal] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
  };
  const handleOpenEdit = (user) => {
    setUserToEdit(user);
    setOpenEditModal(true);
  };

  const handleSaveEditedUser = (editedUser) => {
    const updatedUsers = users.map(u =>
      u.id === editedUser.id ? editedUser : u
    );

    setUsers(updatedUsers);
    triggerToast(`Usuario "${editedUser.nombre}" actualizado.`);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleSelectUser = (id) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedUserIds.length === 0) return;

    const newUsers = users.filter(user => !selectedUserIds.includes(user.id));
    setUsers(newUsers);
    setSelectedUserIds([]);
    triggerToast(`Se eliminaron ${selectedUserIds.length} usuario(s).`);
  };

  const handleAddUserFromModal = (newUserData) => {
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    const newUser = {
      id: newId,
      ...newUserData,
    };

    setUsers([...users, newUser]);
    triggerToast(`Usuario "${newUser.nombre}" agregado.`);
  };

  return (
    <div className="admin-container">
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
          <button className="add-button" onClick={() => setOpenModal(true)}>
            ➕ Agregar Usuario
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
          <p className="no-results">No se encontraron usuarios que coincidan con la búsqueda.</p>
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
                  <tr key={user.id} className={selectedUserIds.includes(user.id) ? 'selected-row' : ''}>
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
                      <span className={`role-tag ${user.rol.toLowerCase()}`}>{user.rol}</span>
                    </td>
                    <td>
                      <button className="edit-action" onClick={() => handleOpenEdit(user)}>
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
