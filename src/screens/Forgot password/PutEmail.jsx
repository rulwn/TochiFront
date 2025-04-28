import React from 'react';
import './PutEmail.css';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Importamos Link
import logo from '../../assets/Logo.png';
import { useNavigate } from 'react-router-dom';


function PutEmail() {
    const navigate = useNavigate();
  
    const handleSendEmail = () => {
      navigate("/putcode");
    };
  
    return (
      <div className="container">
        <div className="form-box">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="form-content">
            <div className="form-left">
              <Link to="/login" className="back-arrow">
                <FaArrowLeft size={20} />
              </Link>
              <h1>¿Olvidaste tu contraseña?</h1>
              <p>Te enviaremos un código de 4 dígitos a tu correo electrónico.</p>
              <label htmlFor="email">Ingresa tu email</label>
              <div className="input-box">
                <input type="email" id="email" placeholder="itsmemamun1@gmail.com" />
              </div>
              <button className="send-button" onClick={handleSendEmail}>Enviar email</button>
              <Link to="/login" className="return-text">
                Regresar al inicio de sesión
              </Link>
            </div>
            <div className="form-right">
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default PutEmail;
  
