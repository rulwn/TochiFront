import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // Archivo CSS para estilos (opcional)

function Profile() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/termsAndConditions');
  };

  return (
    <div className="profile-container">
      <button 
        className="terms-button"
        onClick={handleNavigate}
      >
        Ver Términos y Condiciones
      </button>
    </div>
  );
}

export default Profile;