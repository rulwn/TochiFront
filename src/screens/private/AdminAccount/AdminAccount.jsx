import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuth from './hook/useAuth';
import { FiUser, FiInfo, FiChevronRight, FiLogOut } from 'react-icons/fi';
import './AdminAccount.css';

function AdminProfile() {
  const navigate = useNavigate();
  const { auth, logOut, isLoading, isLoadingUserData, userDetails } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);

  const DEFAULT_IMAGE_URL = "https://res.cloudinary.com/djrbaveph/image/upload/v1747283422/default_mgkskg.jpg";

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isLoading && auth.isAuthenticated) {
      setLocalLoading(false);
    }
  }, [auth.isAuthenticated, isLoading, navigate]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isValidImage = (imageUrl) => {
    return imageUrl && 
           imageUrl !== DEFAULT_IMAGE_URL && 
           imageUrl.trim() !== '';
  };

  const renderProfileImage = () => {
    const userImage = userDetails?.imgUrl || userDetails?.avatar || userDetails?.profileImage;
    const userName = userDetails?.name || userDetails?.firstName || '';
    
    if (isValidImage(userImage)) {
      return (
        <img 
          src={userImage} 
          className="admin-profile-img"
          alt="Profile"
          onError={(e) => {
            e.target.style.display = 'none';
            const fallback = e.target.nextElementSibling;
            if (fallback) {
              fallback.style.display = 'flex';
            }
          }}
        />
      );
    }
    
    return (
      <div className="admin-profile-img admin-profile-img-placeholder" style={{display: 'flex'}}>
        <span className="admin-profile-initials">
          {getInitials(userName)}
        </span>
      </div>
    );
  };

  if (localLoading || isLoading) {
    return (
      <div className="admin-profile-wrapper">
        <div className="admin-profile-loading">
          <div className="loading-spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return null;
  }

  const displayName = userDetails?.name || 
                     userDetails?.firstName || 
                     userDetails?.fullName || 
                     'Usuario';
  
  const displayEmail = userDetails?.email || auth.email || 'Email no disponible';
  const displayPhone = userDetails?.phone || 'No especificado';
  const displayAddress = userDetails?.address || 'No especificado';
  const displayRole = userDetails?.role || auth.role || 'Rol no especificado';

  return (
    <div className="admin-profile-wrapper">
      <div className="admin-profile-container">
        {/* Header del perfil */}
        <div className="admin-profile-header">
          <div className="admin-profile-image-container">
            {renderProfileImage()}
          </div>
          
          <div className="admin-profile-info">
            <h1 className="admin-profile-name">{displayName}</h1>
            <p className="admin-profile-email">{displayEmail}</p>
            <p className="admin-profile-role">{displayRole}</p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="admin-profile-details">
          <h2>Información Personal</h2>
          
          <div className="admin-detail-item">
            <label>Teléfono:</label>
            <span>{displayPhone}</span>
          </div>
          
          <div className="admin-detail-item">
            <label>Dirección:</label>
            <span>{displayAddress}</span>
          </div>
          
          <div className="admin-detail-item">
            <label>Tipo de usuario:</label>
            <span>{displayRole}</span>
          </div>
        </div>

        {/* Opciones del perfil - Estructura original */}
        <div className="admin-profile-options">
          <h2>Menu</h2>
          
          <div className="admin-option-item" onClick={() => navigate('/detailsAdmin')}>
            <div className="admin-option-content">
              <FiUser className="admin-option-icon" />
              <div className="option-text">
                <span>Mis Detalles</span>
               
              </div>
            </div>
            <FiChevronRight className="admin-arrow-icon" />
          </div>
          
          <div className="admin-option-item" onClick={() => navigate('/termsAndConditionsAdmin')}>
            <div className="admin-option-content">
              <FiInfo className="admin-option-icon" />
              <div className="option-text">
                <span>Acerca de</span>
               
              </div>
            </div>
            <FiChevronRight className="admin-arrow-icon" />
          </div>
          
          
        </div>

        {/* Botón de cerrar sesión */}
        <button 
          onClick={handleLogout} 
          className="admin-logout-button"
          disabled={isLoading}
        >
          <FiLogOut className="admin-logout-icon" />
          <span>{isLoading ? 'Cerrando...' : 'Cerrar sesión'}</span>
        </button>

        {isLoadingUserData && (
          <div className="admin-profile-updating">
            <p>Actualizando información...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProfile;