import React from 'react';
import './AdminAccount.css';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiInfo, FiChevronRight, FiLogOut } from 'react-icons/fi';

function AdminAccount() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-account-page">
      <div className="admin-account-container"> 
      <div className="admin-account-header">
        <img 
          src="https://lh3.googleusercontent.com/a-/ALV-UjUN_oQTSuBnJiaR98U0JzFFBMSr29mgrzQNNryHqDEqkP48xnQ=s80-p-k-rw-no" 
          className="admin-account-img"
        />
        <div className="admin-account-info">
          <h1>Wilfredo Granados</h1>
          <p className="admin-account-email">ing_wilfredo@gmail.com</p>
        </div>
      </div>

      <div className="admin-account-options">
        <h2>Menu</h2>  
        <div className="admin-option-item" onClick={() => handleNavigation('/detailsAdmin')}>
          <div className="admin-option-content">
            <FiUser className="admin-option-icon" />
            <span>My Details</span>
          </div>
          <FiChevronRight className="admin-arrow-icon" />
        </div>
      
        <div className="admin-option-item" onClick={() => handleNavigation('/termsAndConditionsAdmin')}>
          <div className="admin-option-content">
            <FiInfo className="admin-option-icon" />
            <span>About</span>
          </div>
          <FiChevronRight className="admin-arrow-icon" />
        </div>
      </div>

      <button className="admin-logout-button" onClick={() => handleNavigation('/login')}>
        <FiLogOut className="admin-logout-icon" />
        <span>Logout</span> 
      </button>
    </div>
    </div>
  );
}

export default AdminAccount;
