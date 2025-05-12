import React, { useState } from 'react';
import { LuSearch, LuPlus, LuFilter, LuSquare, LuCheck, LuX, LuPencil, LuTrash2 } from 'react-icons/lu';
import './AdminUsers.css';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';

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

  // Datos de ejemplo
  const [users, setUsers] = useState([
    {
      _id: '67abc19398090d8e0548dc06',
      name: 'Daniel Brizuela',
      email: 'brizuela@gmail.com',
      password: 'brizuela',
      phone: '+503 4324-5242',
      role: 'Cliente',
      address: 'Santa Tecla',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/800px-User_icon_2.svg.png'
    },
    {
      _id: '67abc19398090d8e0548dc07',
      name: 'Ana Martínez',
      email: 'ana.martinez@empresa.com',
      password: 'admin123',
      phone: '+503 7890-1234',
      role: 'Empleado',
      address: 'San Salvador',
      imgUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      _id: '67abc19398090d8e0548dc08',
      name: 'Carlos López',
      email: 'carlos.lopez@empresa.com',
      password: 'admin456',
      phone: '+503 6543-2109',
      role: 'Empleado',
      address: 'Soyapango',
      imgUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      _id: '67abc19398090d8e0548dc09',
      name: 'María Rodríguez',
      email: 'maria@gmail.com',
      password: 'maria123',
      phone: '+503 2345-6789',
      role: 'Cliente',
      address: 'Antiguo Cuscatlán',
      imgUrl: 'https://randomuser.me/api/portraits/women/65.jpg'
    }
  ]);

  const roles = [
    { value: 'all', label: 'Todos los roles' },
    { value: 'Empleado', label: 'Empleados' },
    { value: 'Cliente', label: 'Clientes' }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'empleados' && user.role === 'Empleado') || 
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

  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u._id !== userId));
    setSelectedUsers(prev => prev.filter(id => id !== userId));
  };

  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveUser = (newUser) => {
    const tempId = Math.random().toString(36).substr(2, 9);
    setUsers(prev => [...prev, { ...newUser, _id: tempId }]);
    setIsAddModalOpen(false);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(prev => 
      prev.map(u => u._id === updatedUser._id ? updatedUser : u)
    );
    setIsEditModalOpen(false);
    setSelectedUsers([]);
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
              className={`tab-btn ${activeTab === 'empleados' ? 'active' : ''}`}
              onClick={() => setActiveTab('empleados')}
            >
              Empleados
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
            >
              <LuPlus size={18} />
              <span>Agregar</span>
            </button>

            <button
              className={`select-users-btn ${selectionMode ? 'active' : ''}`}
              onClick={toggleSelectionMode}
            >
              <LuSquare size={18} />
              <span>{selectionMode ? 'Cancelar' : 'Seleccionar'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="users-grid">
        {filteredUsers.length > 0 ? (
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
        ) : (
          <div className="no-users-message">
            No se encontraron usuarios que coincidan con los filtros.
          </div>
        )}
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
              disabled={selectedUsers.length !== 1}
            >
              <LuPencil size={16} />
              <span>Editar</span>
            </button>
            <button
              className="selection-action-btn delete"
              onClick={() => {
                selectedUsers.forEach(id => handleDeleteUser(id));
                setSelectionMode(false);
              }}
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
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateUser}
        />
      )}
    </div>
  );
}

export default AdminUsers;