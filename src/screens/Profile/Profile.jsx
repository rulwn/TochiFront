import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

import { FiUser, FiHome, FiCreditCard, FiInfo, FiShoppingBag } from 'react-icons/fi';
import { FiChevronRight } from 'react-icons/fi';

function Profile() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img 
          src="https://lh3.googleusercontent.com/a-/ALV-UjUN_oQTSuBnJiaR98U0JzFFBMSr29mgrzQNNryHqDEqkP48xnQ=s80-p-k-rw-no" 
          alt="Profile" 
          className="profile-img"
        />
        <div className="profile-info">
          <h1>Wilfredo Granados</h1>
          <p className="email">ing_wilfredo@gmail.com</p>
        </div>
      </div>

      <div className="profile-options">
        <h2>Menu</h2>
        
        <div className="option-item" onClick={() => handleNavigation('/orders')}>
          <div className="option-content">
            <FiShoppingBag className="option-icon" />
            <span>Orders</span>
          </div>
          <FiChevronRight className="arrow-icon" />
        </div>
        
        <div className="option-item" onClick={() => handleNavigation('/my-details')}>
          <div className="option-content">
            <FiUser className="option-icon" />
            <span>My Details</span>
          </div>
          <FiChevronRight className="arrow-icon" />
        </div>
        
        <div className="option-item" onClick={() => handleNavigation('/delivery-address')}>
          <div className="option-content">
            <FiHome className="option-icon" />
            <span>Delivery Address</span>
          </div>
          <FiChevronRight className="arrow-icon" />
        </div>
        
        <div className="option-item" onClick={() => handleNavigation('/payment-methods')}>
          <div className="option-content">
            <FiCreditCard className="option-icon" />
            <span>Payment Methods</span>
          </div>
          <FiChevronRight className="arrow-icon" />
        </div>
        
        <div className="option-item" onClick={() => handleNavigation('/about')}>
          <div className="option-content">
            <FiInfo className="option-icon" />
            <span>About</span>
          </div>
          <FiChevronRight className="arrow-icon" />
        </div>
      </div>
    </div>
  );
}

export default Profile;