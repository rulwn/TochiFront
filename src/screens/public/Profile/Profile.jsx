import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuth from './hook/useAuth';
import './Profile.css';

import { 
  FiUser, 
  FiHome, 
  FiCreditCard, 
  FiInfo, 
  FiShoppingBag,
  FiLogOut 
} from 'react-icons/fi';
import { FiChevronRight } from 'react-icons/fi';

function Profile() {
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
     if (!name) return 'U';
    return name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isValidImage = (imageUrl) => {
    return imageUrl && 
           imageUrl !== DEFAULT_IMAGE_URL && 
           imageUrl.trim() !== '' &&
           !imageUrl.includes('default_mgkskg');
  };

  const renderProfileImage = () => {
    const userImage = userDetails?.imgUrl || userDetails?.avatar || userDetails?.profileImage;
    const userName = userDetails?.name || userDetails?.firstName || '';
    
    if (isValidImage(userImage)) {
      return (
        <div className="profile-image-container">
          <img 
            src={userImage} 
            className="profile-img"
            alt="Profile"
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = document.querySelector('.profile-img-placeholder');
              if (fallback) {
                fallback.style.display = 'flex';
              }
            }}
          />
          <div className="profile-img profile-img-placeholder" style={{display: 'none'}}>
            <span className="profile-initials">
              {getInitials(userName)}
            </span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="profile-img profile-img-placeholder">
        <span className="profile-initials">
          {getInitials(userName)}
        </span>
      </div>
    );
  };

  if (localLoading || isLoading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
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

  return (
    <div className="profile-container">
      <div className="profile-header">
        {renderProfileImage()}
        <div className="profile-info">
          <h1>{displayName}</h1>
          <p className="email">{displayEmail}</p>
        </div>
      </div>

      <div className="profile-options">
        <h2>Menu</h2>
        
        <div className="option-item" onClick={() => navigate('/orders')}>
          <div className="option-content">
            <FiShoppingBag className="option-icon" />
            <span>Orders</span>
          </div>
          <FiChevronRight className="arrow-icon" />
        </div>
        
        <div className="option-item" onClick={() => navigate('/userdetails')}>
          <div className="option-content">
            <FiUser className="option-icon" />
            <span>My Details</span>
          </div>
          <FiChevronRight className="arrow-icon" />
        </div>
        
        <div className="option-item" onClick={() => navigate('/deliveryaddress')}>
          <div className="option-content">
            <FiHome className="option-icon" />
            <span>Delivery Address</span>
          </div>
          <FiChevronRight className="arrow-icon" />
        </div>
        
        <div className="option-item" onClick={() => navigate('/payment')}>
          <div className="option-content">
            <FiCreditCard className="option-icon" />
            <span>Payment Methods</span>
          </div>
          <FiChevronRight className="arrow-icon" />
        </div>
        
        <div className="option-item" onClick={() => navigate('/termsAndConditions')}>
          <div className="option-content">
            <FiInfo className="option-icon" />
            <span>About</span>
          </div>
          <FiChevronRight className="arrow-icon" />
        </div>
      </div>

      <button 
        className="logout-button" 
        onClick={handleLogout}
        disabled={isLoading}
      >
        <FiLogOut className="logout-icon" />
        <span>{isLoading ? 'Cerrando...' : 'Logout'}</span> 
      </button>

      {isLoadingUserData && (
        <div className="profile-updating">
          <p>Actualizando información...</p>
        </div>
      )}
    </div>
  );
}

export default Profile;