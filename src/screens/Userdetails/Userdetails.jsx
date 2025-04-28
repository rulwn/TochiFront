import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDetails.css';
import { FiChevronLeft, FiEdit, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

function UserDetails() {
  const navigate = useNavigate();
  
  const userData = {
    name: 'Wilfredo Granados',
    email: 'ing_wilfredo@gmail.com',
    phone: '+503 7890-1234',
    role: 'Cliente',
    address: 'Av. Las Magnolias #123, San Salvador, El Salvador'
  };

  return (
    <div className="user-details-container">
      <header className="user-details-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiChevronLeft /> Volver
        </button>
        <h1>Mis Detalles</h1>
      </header>

      <div className="user-profile-card">
        <div className="user-avatar">
          <FiUser className="avatar-icon" />
        </div>
        
        <div className="user-info">
          <div className="info-item">
            <FiUser className="info-icon" />
            <div>
              <label>Nombre completo</label>
              <p>{userData.name}</p>
            </div>
          </div>
          
          <div className="info-item">
            <FiMail className="info-icon" />
            <div>
              <label>Correo electrónico</label>
              <p>{userData.email}</p>
            </div>
          </div>
          
          <div className="info-item">
            <FiPhone className="info-icon" />
            <div>
              <label>Teléfono</label>
              <p>{userData.phone}</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-icon role-icon">
              <span>{userData.role.charAt(0)}</span>
            </div>
            <div>
              <label>Tipo de cuenta</label>
              <p>{userData.role}</p>
            </div>
          </div>
          
          <div className="info-item">
            <FiMapPin className="info-icon" />
            <div>
              <label>Dirección</label>
              <p>{userData.address}</p>
            </div>
          </div>
        </div>
      </div>

      <button className="edit-button">
        <FiEdit /> Editar información
      </button>
    </div>
  );
}

export default UserDetails;