import React, { useEffect, useState } from 'react';
import './AdminAccount.css';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiInfo, FiChevronRight, FiLogOut } from 'react-icons/fi';

function AdminAccount() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userEmail = localStorage.getItem('userEmail');
        

        if (!token || !userEmail) {
          throw new Error('Sesión no encontrada. Por favor inicie sesión.');
        }

        const response = await fetch(`https://tochi-api.onrender.com/api/users/email/${encodeURIComponent(userEmail)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}`);
        }

        const json = await response.json();

        if (!json.success || !json.data) {
          throw new Error('Datos de usuario no válidos');
        }

        const data = json.data;

        setUserData({
          name: data.name || 'Nombre no especificado',
          email: data.email,
          avatar: data.imgUrl || 'https://via.placeholder.com/80',
          role: data.role || 'Rol no especificado',
          phone: data.phone || 'No especificado',
          address: data.address || 'No especificado'
        });

      } catch (error) {
        console.error('Error en fetchUserData:', error);
        setError(error.message);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="admin-account-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando información del usuario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-account-page">
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => window.location.reload()}>Reintentar</button>
            <button onClick={() => navigate('/login')}>Ir al login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-account-page">
      <div className="admin-account-container">
        <div className="admin-account-header">
          <img
            src={userData.avatar}
            className="admin-account-img"
            alt="Profile"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/80';
            }}
          />
          <div className="admin-account-info">
            <h1>{userData.name}</h1>
            <p className="admin-account-email">{userData.email}</p>
            <p className="admin-account-role">{userData.role}</p>
          </div>
        </div>

        <div className="admin-account-options">
          <h2>Menu</h2>
          <div className="admin-option-item" onClick={() => navigate('/detailsAdmin')}>
            <FiUser className="admin-option-icon" />
            <div className="option-text">
              <span>My Details</span>
              <small>Phone: {userData.phone}</small>
            </div>
            <FiChevronRight className="admin-arrow-icon" />
          </div>

          <div className="admin-option-item" onClick={() => navigate('/termsAndConditionsAdmin')}>
            <FiInfo className="admin-option-icon" />
            <div className="option-text">
              <span>About</span>
              <small>Address: {userData.address}</small>
            </div>
            <FiChevronRight className="admin-arrow-icon" />
          </div>
        </div>

        <button className="admin-logout-button" onClick={handleLogout}>
          <FiLogOut className="admin-logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default AdminAccount;
