import React, { useState, useEffect } from 'react';
import { LuSearch, LuPlus, LuFilter, LuSquare, LuCheck, LuX, LuPencil, LuTrash2 } from 'react-icons/lu';
import './AdminUsers.css';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import useUserData from './hook/useUserData';

const UserCard = ({
  user,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  selectionMode
}) => {
  return (
    <div
      className={`admin-user-card ${selectionMode ? 'selection-mode' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => selectionMode && onSelect(user._id)}
    >
      {isSelected && (
        <div className="selection-checkmark">
          <LuCheck size={16} />
        </div>
      )}

      <div className="admin-user-image-container">
        <img
          src={user.imgUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/800px-User_icon_2.svg.png'}
          alt={user.name}
          className="admin-user-image"
        />
      </div>

      <div className="admin-user-info">
        <h3 className="admin-user-name">{user.name}</h3>
        <div className="admin-user-meta">
          <span className="admin-user-role">{user.role}</span>
          <span className="admin-user-phone">
            {user.phone}
          </span>
        </div>
        <div className="admin-user-details">
          <div className="admin-user-email-container">
            <span className="admin-user-email">{user.email}</span>
          </div>
          {user.address && (
            <div className="admin-user-address-container">
              <span className="admin-user-address">{user.address}</span>
            </div>
          )}
        </div>
      </div>

      <div className="admin-user-actions">
        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (!selectionMode) {
              onEdit(user);
            }
          }}
          aria-label="Editar usuario"
          disabled={selectionMode}
        >
          <LuPencil size={18} />
        </button>
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(user._id);
          }}
          aria-label="Eliminar usuario"
        >
          <LuTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Usar el hook personalizado para manejar usuarios
  const {
    users,
    isLoading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  } = useUserData();

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers().catch(err => {
      console.error('Error al cargar usuarios:', err);
    });
  }, [fetchUsers]);

  const roles = [
    { value: 'all', label: 'Todos los roles' },
    { value: 'Cliente', label: 'Clientes' }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'Administradores' && user.role === 'Administrador') ||
      (activeTab === 'clientes' && user.role === 'Cliente');

    return matchesSearch && matchesRole && matchesTab;
  });

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      // Aquí puedes mostrar un mensaje de error al usuario
    }
  };

  const handleBulkDelete = async () => {
    try {
      // Eliminar múltiples usuarios
      await Promise.all(selectedUsers.map(id => deleteUser(id)));
      setSelectedUsers([]);
      setSelectionMode(false);
    } catch (err) {
      console.error('Error al eliminar usuarios:', err);
    }
  };

  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };



  const handleSaveUser = async (userData) => {
    console.log('Datos recibidos en handleSaveUser:', userData);

    try {
      const newUser = await createUser(userData);
      console.log('Usuario creado exitosamente:', newUser);
      await fetchUsers();
    } catch (err) {
      console.error('Error al crear usuario:', err);
      throw err;
    }
  };
  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (updatedUserData) => {
  try {
    console.log('Actualizando usuario con datos:', updatedUserData);
    
    await updateUser(editingUser._id, updatedUserData);
    
    console.log('Usuario actualizado exitosamente');
    
    // Recargar la lista de usuarios después de una actualización exitosa
    await fetchUsers();
    
    setSelectedUsers([]);
    
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    throw new Error(err.message || 'Error al actualizar el usuario');
  }
};

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedUsers([]);
    }
  };


  return (
    <div className="admin-users-container">
      <div className="admin-toolbar">
        <h1 className="admin-title">Gestión de Usuarios</h1>

        <div className="tab-controls">
          <div className="tab-bar">
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Todos
            </button>
            <button
              className={`tab-btn ${activeTab === 'Administradores' ? 'active' : ''}`}
              onClick={() => setActiveTab('Administradores')}
            >
              Administradores
            </button>
            <button
              className={`tab-btn ${activeTab === 'clientes' ? 'active' : ''}`}
              onClick={() => setActiveTab('clientes')}
            >
              Clientes
            </button>
          </div>

          <div className="search-filter-container">
            <div className="search-container-user">
              <LuSearch className="search-icon-user" size={20} />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                className="search-input-user"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className="add-user-btn"
              onClick={handleAddUser}
              disabled={isLoading}
            >
              <LuPlus size={18} />
              <span>Agregar</span>
            </button>

            <button
              className={`select-users-btn ${selectionMode ? 'active' : ''}`}
              onClick={toggleSelectionMode}
              disabled={isLoading}
            >
              <LuSquare size={18} />
              <span>{selectionMode ? 'Cancelar' : 'Seleccionar'}</span>
            </button>
          </div>
        </div>
      </div>


      {/* Mostrar indicador de carga */}
      {isLoading && (
        <div className="loading-indicator">
          Cargando usuarios...
        </div>
      )}

      <div className="users-grid">
        {!isLoading && filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <UserCard
              key={user._id}
              user={user}
              isSelected={selectedUsers.includes(user._id)}
              onSelect={toggleUserSelection}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              selectionMode={selectionMode}
            />
          ))
        ) : !isLoading && filteredUsers.length === 0 ? (
          <div className="no-users-message">
            No se encontraron usuarios que coincidan con los filtros.
          </div>
        ) : null}
      </div>

      {selectionMode && selectedUsers.length > 0 && (
        <div className="selection-actions-bar">
          <div className="selected-count">
            {selectedUsers.length} seleccionados
          </div>
          <div className="selection-actions">
            <button
              className={`selection-action-btn ${selectedUsers.length !== 1 ? 'disabled' : ''}`}
              onClick={() => {
                if (selectedUsers.length === 1) {
                  const userToEdit = users.find(u => u._id === selectedUsers[0]);
                  handleEditUser(userToEdit);
                }
              }}
              disabled={selectedUsers.length !== 1 || isLoading}
            >
              <LuPencil size={16} />
              <span>Editar</span>
            </button>
            <button
              className="selection-action-btn delete"
              onClick={handleBulkDelete}
              disabled={isLoading}
            >
              <LuTrash2 size={16} />
              <span>Eliminar</span>
            </button>
            <button
              className="selection-action-btn cancel"
              onClick={() => setSelectedUsers([])}
            >
              <LuX size={16} />
              <span>Deseleccionar</span>
            </button>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <AddUserModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveUser}
        />
      )}

      {isEditModalOpen && (
        <EditUserModal
          user={editingUser}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingUser(null);
          }}
          onSave={handleUpdateUser}
          isLoading={isLoading}
        />
      )}

    </div>
  );
}

export default AdminUsers;