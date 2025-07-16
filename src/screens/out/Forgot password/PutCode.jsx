import React, { useRef, useState, useEffect } from 'react';
import './PutCode.css';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/Logo.png';
import rightImage from '../../../assets/pass2.png';

function PutCode() {
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const [code, setCode] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Obtener el email del localStorage
        const storedEmail = localStorage.getItem('resetEmail');
        if (!storedEmail) {
            // Si no hay email, redirigir al paso anterior
            navigate('/putemail');
            return;
        }
        setEmail(storedEmail);
    }, [navigate]);

    const handleInputChange = (e, index) => {
        const value = e.target.value;
        
        // Solo permitir números
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto focus al siguiente input
        if (value.length === 1 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSendCode = async () => {
        const verificationCode = code.join('');
        
        if (verificationCode.length !== 4) {
            setError('Por favor ingresa el código completo de 4 dígitos');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:4000/api/users/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email,
                    code: verificationCode 
                })
            });

            const data = await response.json();

            if (data.success) {
                // Guardar el token de reset para el siguiente paso
                localStorage.setItem('resetToken', data.resetToken);
                
                // Navegar al componente de nueva contraseña
                navigate("/newpassword");
            } else {
                setError(data.message || 'Código incorrecto');
                
                // Si hay intentos restantes, mostrarlos
                if (data.attemptsLeft) {
                    setError(`${data.message}. Intentos restantes: ${data.attemptsLeft}`);
                }
                
                // Limpiar los inputs si el código es incorrecto
                setCode(['', '', '', '']);
                inputRefs.current[0].focus();
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:4000/api/users/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                setCode(['', '', '', '']);
                setError('');
                alert('Nuevo código enviado a tu email');
                inputRefs.current[0].focus();
            } else {
                setError(data.message || 'Error al reenviar el código');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
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
                                onClick={() => navigate('/putemail')}
                                style={{ cursor: 'pointer' }}
                            />
                            <span className="back-text">Ingrese su código</span>
                        </div>

                        <p className="subtitle">
                            Ingresa el código de 4 dígitos que enviamos a {email}
                        </p>

                        <div className="code-inputs">
                            {[0, 1, 2, 3].map((index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={code[index]}
                                    ref={el => inputRefs.current[index] = el}
                                    onChange={(e) => handleInputChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    disabled={loading}
                                    className="code-input"
                                />
                            ))}
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <button 
                            className="send-button" 
                            onClick={handleSendCode}
                            disabled={loading}
                        >
                            {loading ? 'Verificando...' : 'Enviar código'}
                        </button>

                        <button 
                            className="resend-code-button" 
                            onClick={handleResendCode}
                            disabled={loading}
                            type="button"
                        >
                            ¿No recibiste el código? Reenviar
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