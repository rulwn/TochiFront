import React, { useState } from 'react'
import './Login.css'
import logo from '../../../assets/Logo.png';
import { Link, useNavigate } from 'react-router-dom';

// Mock user database
const mockUsers = [
  {
    email: 'admin@tochi.com',
    password: 'admin123',
    type: 'admin',
    name: 'Administrator'
  },
  {
    email: 'client@tochi.com',
    password: 'client123',
    type: 'client',
    name: 'Regular Client'
  },
  // Add more mock users as needed
];

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (email.trim() === '' || password.trim() === '') {
      setError('Please fill in both fields.');
      return;
    }

    // Check against mock users
    const user = mockUsers.find(
      user => user.email === email && user.password === password
    );

    if (user) {
      // Successful login - navigate based on user type
      if (user.type === 'admin') {
        navigate("/admin-dashboard"); // Change this to your admin route
      } else {
        navigate("/"); // Regular client goes to home/store
      }
      
      // In a real app, you would store the user data in context/state/store
      console.log(`Logged in as ${user.name} (${user.type})`);
    } else {
      setError('Invalid email or password.');
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

            <button type="submit" className="login-button">Log In</button>
          </form>

          <p className="signup-text">
            Don't have an account? <Link to="/registro">Signup</Link>
          </p>

          {/* For testing purposes - remove in production */}
          <div className="test-credentials">
            <p><strong>Test credentials:</strong></p>
            <p>Admin: admin@tochi.com / admin123</p>
            <p>Client: client@tochi.com / client123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;