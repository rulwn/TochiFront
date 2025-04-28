import React, { useState } from 'react'
import './Login.css'
import logo from '../../assets/Logo.png'
import Registro from '../Registro/Registro';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleHome = (e) => {
    e.preventDefault(); // Evita que el form se recargue
    if (email.trim() === '' || password.trim() === '') {
      alert('Please fill in both fields.');
      return; // No lo deja avanzar
    }
    navigate("/"); // Si sí llenó los campos, lo manda al home
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Tochi Logo" className="logo-img" />
        <div className="login-form">
          <h2>Login</h2>
          <p className="subtitle">Enter your email and password</p>
          <form onSubmit={handleHome}>
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

            <button type="submit" className="login-button">Log In</button>
          </form>

          <p className="signup-text">
            Don’t have an account? <Link to="/registro">Signup</Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login
