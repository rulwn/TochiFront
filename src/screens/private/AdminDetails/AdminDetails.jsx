import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDetails.css';
import { FiChevronLeft, FiEdit, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

function AdminDetails() {
  const navigate = useNavigate();
  
  const adminData = {
    name: 'Wilfredo Granados',
    email: 'ing_wilfredo@gmail.com',
    phone: '+503 7890-1234',
    role: 'Administrador',
    address: 'Av. Las Magnolias #123, San Salvador, El Salvador'
  };

  return (
    <div className="admin-details-page">

      <div className="admin-details-container">
      <header className="admin-details-header">
        <button className="admin-back-button" onClick={() => navigate(-1)}>
          <FiChevronLeft /> Volver
        </button>
        <h1>Mis Detalles</h1>
      </header>

      <div className="admin-profile-card">
        <div className="admin-avatar">
          <FiUser className="admin-avatar-icon" />
        </div>
        
        <div className="admin-info">
          <div className="admin-info-item">
            <FiUser className="admin-info-icon" />
            <div>
              <label>Nombre completo</label>
              <p>{adminData.name}</p>
            </div>
          </div>
          
          <div className="admin-info-item">
            <FiMail className="admin-info-icon" />
            <div>
              <label>Correo electrónico</label>
              <p>{adminData.email}</p>
            </div>
          </div>
          
          <div className="admin-info-item">
            <FiPhone className="admin-info-icon" />
            <div>
              <label>Teléfono</label>
              <p>{adminData.phone}</p>
            </div>
          </div>
          
          <div className="admin-info-item">
            <div className="admin-info-icon admin-role-icon">
              <span>{adminData.role.charAt(0)}</span>
            </div>
            <div>
              <label>Tipo de cuenta</label>
              <p>{adminData.role}</p>
            </div>
          </div>
          
          <div className="admin-info-item">
            <FiMapPin className="admin-info-icon" />
            <div>
              <label>Dirección</label>
              <p>{adminData.address}</p>
            </div>
          </div>
        </div>
      </div>

      <button className="admin-edit-button">
        <FiEdit /> Editar información
      </button>
    </div>

    </div>
  );
}

export default AdminDetails;