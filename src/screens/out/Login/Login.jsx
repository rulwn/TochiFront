import React, { useState } from 'react'
import './Login.css'
import logo from '../../../assets/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { Login: contextLogin, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const result = await contextLogin(email, password);
    
    if (result.success) {
      if (result.role.toLowerCase() === 'administrador') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.error || 'Error en el login');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Tochi Logo" className="logo-img" />
        <div className="login-form">
          <h2>Login</h2>
          <p className="subtitle">Ingresa tu email y contraseña</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Ingresa tu email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="show-password">
              <input
                type="checkbox"
                id="showPassword"
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword"> Mostrar contraseña</label>
            </div>

            <div className="forgot-password">
              <p><Link to={'/putemail'}>¿Olvidaste tu contraseña?</Link></p>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="signup-text">
            ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login;