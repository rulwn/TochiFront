import React, { useRef } from 'react';
import './PutCode.css';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../../assets/Logo.png';

function PutCode() {
  const inputRefs = useRef([]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
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
            <h1>Ingrese su código</h1>
            <p>Ingresa el código de 4 dígitos que recibiste en tu correo electrónico.</p>
            <div className="code-inputs">
              {[0, 1, 2, 3].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={el => inputRefs.current[index] = el}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
            <button className="send-button">Enviar código</button>
            <Link to="/login" className="return-text">
              Regresar
            </Link>
          </div>
          <div className="form-right">
          </div>
        </div>
      </div>
    </div>
  );
}

export default PutCode;
