import React from 'react';
import './Registro.css';
import logo from '../../../assets/Logo.png';
import { Link } from 'react-router-dom';

function Registro() {
  return (
    <div className="registro-container">
      <div className="form-card">
        <img src={logo} alt="Tochi Logo" className="logo" />
        <h2>Sign Up</h2>
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
          
          <div className="terms">
            By continuing you agree to our{' '}
            <Link to="/termsAndConditions">Terms of Service</Link> and{' '}
            <Link to="/termsAndConditions">Privacy Policy</Link>.
          </div>

          {/* Botón que lleva a login */}
          <Link to="/login" className="btn-link">
            <button type="button">Sign Up</button>
          </Link>

          <p className="signin-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Registro;
