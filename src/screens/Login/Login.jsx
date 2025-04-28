import React, { useState } from 'react'
import './Login.css'
import logo from '../../assets/Logo.png'
import Registro from '../Registro/Registro';
import { Link } from 'react-router-dom';



function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Tochi Logo" className="logo-img" />
        <div className="login-form">
          <h2>Login</h2> {/* corregí "Loging" a "Login" */}
          <p className="subtitle">Enter your email and password</p>
          <form>
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />

            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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
