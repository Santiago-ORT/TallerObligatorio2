import React, { useState, useMemo } from 'react';
import './AdmUsuarios.css';


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
    alert(`Se eliminaron ${selectedUserIds.length} usuario(s).`);
  };

  const handleAddUser = () => {
   
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      nombre: `Nuevo Usuario ${newId}`,
      email: `nuevo.${newId}@app.com`,
      rol: 'Usuario',
    };
    setUsers([...users, newUser]);
    alert(`Usuario ${newId} agregado.`);
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
          <button className="add-button" onClick={handleAddUser}>
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

      <div className="user-list">
        {filteredUsers.length === 0 ? (
          <p className="no-results">No se encontraron usuarios que coincidan con la búsqueda.</p>
        ) : (
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
                  <td><span className={`role-tag ${user.rol.toLowerCase()}`}>{user.rol}</span></td>
                  <td>
                    <button className="edit-action">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdmUsuarios;