import React, { useState } from 'react';
import './NewPassword.css';
import logo from '../../assets/Logo.png';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import rightImage from '../../assets/pass3.png';

function NewPassword() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
};


  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  return (
    <>
      <div className="container">
        <div className="form-box">
          <div className="form-content">
            <div className="form-left">
              <div className="logo">
                <img src={logo} alt="Logo" />
              </div>

              <div className="back-section">
                <FaArrowLeft
                  size={20}
                  className="back-icon"
                  onClick={() => navigate(-1)}
                  style={{ cursor: 'pointer' }}
                />
                <span className="back-text">Restablecer contraseña</span>
              </div>

              <p className="subtitle">
                Establece la nueva contraseña para que puedas acceder a todas las funciones.
              </p>

              <div className="form-group">
                <input
                  type={showPassword1 ? "text" : "password"}
                  placeholder="Nueva contraseña"
                  id="password1"
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword1(!showPassword1)}
                >
                  {showPassword1 ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="form-group">
                <input
                  type={showPassword2 ? "text" : "password"}
                  placeholder="Re-ingrese contraseña"
                  id="password2"
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword2(!showPassword2)}
                >
                  {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button className="send-button" onClick={handleLogin}>
                Actualizar Contraseña
              </button>
            </div>

            <div className="form-right">
              <img src={rightImage} alt="Imagen decorativa" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewPassword;
