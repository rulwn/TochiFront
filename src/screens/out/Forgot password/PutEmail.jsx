import React from 'react';
import './PutEmail.css';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; 
import logo from '../../../assets/Logo.png';
import rightImage from '../../../assets/pass1.png'; 

function PutEmail() {
  const navigate = useNavigate();

  const handleSendEmail = () => {
    navigate("/putcode");
  };

  return (
    <div className="container">
      <div className="form-box">
        <div className="form-content">
          
          <div className="form-left">
            <div className="logo">
              <img src={logo} alt="Logo" />
            </div>

            <div className="back-section">
              <Link to="/login" className="back-arrow">
                <FaArrowLeft size={20} className="back-icon" />
                <span className="back-text">¿Olvidaste tu contraseña?</span>
              </Link>
            </div>

            <p className="subtitle">
              Te enviaremos un código de 4 dígitos a tu correo electrónico.
            </p>

            <div className="form-group">
              <label htmlFor="email">Ingresa tu email</label>
              <input type="email" id="email" placeholder="correo@example.com" />
            </div>

            <button className="send-button" onClick={handleSendEmail}>
              Enviar email
            </button>

            <Link to="/login" className="return-text">
              Regresar al inicio de sesión
            </Link>
          </div>

          <div className="form-right">
            <img src={rightImage} alt="Imagen de recuperación" />
          </div>

        </div>
      </div>
    </div>
  );
}

export default PutEmail;
