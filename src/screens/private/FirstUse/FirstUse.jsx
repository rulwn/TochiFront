import React from 'react';
import './FirstUse.css';    
import logo from '../../../assets/LogoBlanco.png';
import { Link } from 'react-router-dom';

function FirstUse() {
  return (
    <div className="firstuse-container">
      <div className="firstuse-card">
        <img src={logo} alt="Tochi Logo" className="firstuse-logo" />
        <h2>First Use sign in</h2>
        <p>Enter your credentials to continue</p>
        <form>
          <label>Username</label>
          <input type="text" placeholder="Raúl Ochoa" />
          
          <label>Email</label>
          <input type="email" placeholder="raulochoa@gmail.com" />
          
          <label>Dirección</label>
          <input type="text" placeholder="San Salvador, calle 26, av 37." />
          
          <label>Teléfono</label>
          <input type="tel" placeholder="+503 7234-3394" />
          
          <label>Password</label>
          <input type="password" placeholder="********" />
          
          <div className="firstuse-terms">
            By continuing you agree to our{' '}
            <Link to="/termsAndConditions">Terms of Service</Link> and{' '}
            <Link to="/termsAndConditions">Privacy Policy</Link>.
          </div>

          <Link to="/login" className="firstuse-btn-link">
            <button type="button">Sign Up</button>
          </Link>

          <p className="firstuse-signin-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default FirstUse;
