import React, { useState } from 'react';
import './PutEmail.css';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/Logo.png';
import rightImage from '../../../assets/pass1.png';

function PutEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendEmail = async () => {
    // Validaciones básicas
    if (!email) {
      setError('Por favor ingresa tu email');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Cambiar la URL para que sea relativa (sin puerto hardcodeado)
      const response = await fetch('http://localhost:4000/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        // Guardar el email en localStorage para el siguiente paso
        localStorage.setItem('resetEmail', email);
        
        // Mostrar mensaje de éxito
        setSuccess('¡Código enviado! Revisa tu email y verifica tu bandeja de spam.');
        
        // Esperar 2 segundos para que el usuario vea el mensaje y luego navegar
        setTimeout(() => {
          navigate("/putcode");
        }, 2000);
      } else {
        setError(data.message || 'Error al enviar el código');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión. Verifica tu internet e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
              <input 
                type="email" 
                id="email" 
                placeholder="correo@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                onKeyPress={(e) => e.key === 'Enter' && handleSendEmail()}
              />
            </div>

            {error && (
              <div className="error-message" style={{
                color: '#721c24', 
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c6cb',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '10px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message" style={{
                color: '#155724', 
                backgroundColor: '#d4edda',
                border: '1px solid #c3e6cb',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '10px',
                fontSize: '14px'
              }}>
                {success}
              </div>
            )}

            <button 
              className="send-button" 
              onClick={handleSendEmail}
              disabled={loading || !email}
              style={{
                opacity: loading || !email ? 0.6 : 1,
                cursor: loading || !email ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Enviando...' : 'Enviar email'}
            </button>

            {loading && (
              <div style={{
                textAlign: 'center',
                fontSize: '12px',
                color: '#6c757d',
                marginTop: '10px'
              }}>
                📧 Enviando código de verificación...
              </div>
            )}

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