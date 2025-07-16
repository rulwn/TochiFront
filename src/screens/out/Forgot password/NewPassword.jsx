import React, { useState, useEffect } from 'react';
import './NewPassword.css';
import logo from '../../../assets/Logo.png';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import rightImage from '../../../assets/pass3.png';

function NewPassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resetToken, setResetToken] = useState('');

    useEffect(() => {
        // Obtener el token del localStorage
        const storedToken = localStorage.getItem('resetToken');
        if (!storedToken) {
            // Si no hay token, redirigir al inicio
            navigate('/putemail');
            return;
        }
        setResetToken(storedToken);
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validatePassword = () => {
        if (!formData.newPassword || !formData.confirmPassword) {
            setError('Todos los campos son requeridos');
            return false;
        }

        if (formData.newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return false;
        }

        return true;
    };

    const handleUpdatePassword = async () => {
        if (!validatePassword()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:4000/api/users/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resetToken: resetToken,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                // Limpiar el localStorage
                localStorage.removeItem('resetEmail');
                localStorage.removeItem('resetToken');
                
                // Mostrar mensaje de éxito y redirigir al login
                alert('¡Contraseña actualizada correctamente! Ya puedes iniciar sesión.');
                navigate('/login');
            } else {
                setError(data.message || 'Error al cambiar la contraseña');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Verificar fortaleza de contraseña en tiempo real
    const getPasswordStrength = () => {
        const password = formData.newPassword;
        let strength = 0;
        
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        return strength;
    };

    const getStrengthText = () => {
        const strength = getPasswordStrength();
        if (strength < 2) return { text: 'Débil', color: '#dc3545' };
        if (strength < 4) return { text: 'Media', color: '#fd7e14' };
        return { text: 'Fuerte', color: '#28a745' };
    };

    const strengthInfo = getStrengthText();

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
                                    onClick={() => navigate('/putcode')}
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
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                                <span
                                    className="toggle-password"
                                    onClick={() => setShowPassword1(!showPassword1)}
                                >
                                    {showPassword1 ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            {formData.newPassword && (
                                <div className="password-strength">
                                    <span>Fortaleza: </span>
                                    <span style={{ color: strengthInfo.color, fontWeight: 'bold' }}>
                                        {strengthInfo.text}
                                    </span>
                                </div>
                            )}

                            <div className="form-group">
                                <input
                                    type={showPassword2 ? "text" : "password"}
                                    placeholder="Re-ingrese contraseña"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                                <span
                                    className="toggle-password"
                                    onClick={() => setShowPassword2(!showPassword2)}
                                >
                                    {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                                <div className="password-match-error">
                                    Las contraseñas no coinciden
                                </div>
                            )}

                            <div className="password-requirements">
                                <p>La contraseña debe tener:</p>
                                <ul>
                                    <li style={{color: formData.newPassword.length >= 6 ? '#28a745' : '#dc3545'}}>
                                        ✓ Al menos 6 caracteres
                                    </li>
                                    <li style={{color: formData.newPassword === formData.confirmPassword && formData.confirmPassword ? '#28a745' : '#dc3545'}}>
                                        ✓ Las contraseñas deben coincidir
                                    </li>
                                </ul>
                            </div>

                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            <button 
                                className="send-button" 
                                onClick={handleUpdatePassword}
                                disabled={loading || !formData.newPassword || !formData.confirmPassword}
                            >
                                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
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