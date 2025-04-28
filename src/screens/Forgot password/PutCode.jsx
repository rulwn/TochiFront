import React, { useRef } from 'react';
import './PutCode.css';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo.png';
import rightImage from '../../assets/pass2.png';

function PutCode() {
    const inputRefs = useRef([]);
    const navigate = useNavigate();

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

    const handleSendCode = () => {
        navigate("/newpassword");
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
                            <FaArrowLeft
                                size={20}
                                className="back-icon"
                                onClick={() => navigate(-1)}
                                style={{ cursor: 'pointer' }}
                            />
                            <span className="back-text">Ingrese su código</span>
                        </div>

                        <p className="subtitle">
                            Ingresa el código de 4 dígitos que recibiste en tu correo electrónico.
                        </p>

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

                        <button className="send-button" onClick={handleSendCode}>
                            Enviar código
                        </button>

                        <Link to="/putemail" className="return-text">
                            Regresar
                        </Link>
                    </div>

                    <div className="form-right">
                        <img src={rightImage} alt="Recuperación de contraseña" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PutCode;
