import React, { useState } from 'react'
import './Login.css'
import logo from '../../../assets/Logo.png';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (email.trim() === '' || password.trim() === '') {
      setError('Please fill in both fields.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Para manejar las cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Si el login es exitoso
      console.log('Login successful', data);
      
      // Guardar el token en localStorage (opcional)
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      // Verificar el rol del usuario para redirigir
      if (data.role === 'admin') {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Tochi Logo" className="logo-img" />
        <div className="login-form">
          <h2>Login</h2>
          <p className="subtitle">Enter your email and password</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="show-password">
              <input
                type="checkbox"
                id="showPassword"
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword"> Show password</label>
            </div>

            <div className="forgot-password">
              <p><Link to={'/putemail'}>Forgot Password?</Link></p>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="signup-text">
            Don't have an account? <Link to="/registro">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login;