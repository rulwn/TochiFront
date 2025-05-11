import React from 'react';
import '../Nav/NavAdmin.css';
import logo from '../../assets/LogoBlanco.png';
import { Link, useLocation } from 'react-router-dom';
import { LuApple, LuUsers, LuSettings, LuLayoutDashboard, LuListOrdered } from "react-icons/lu";

function NavAdmin() {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="navbar-admin">
      <div></div> 
      <Link to="/admin-dashboard" className="logo-link">
        <img src={logo} alt="Logo Tochi" className="logo"/>
      </Link>
      <div className="admin-nav-options">
        <Link 
          to="/admin-dashboard" 
          className={`admin-nav-item ${isActive('/admin-dashboard') ? 'active' : ''}`}
        >
          <LuLayoutDashboard className='nav-icon' size={25} />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          to="/admin-products" 
          className={`admin-nav-item ${isActive('/admin-products') ? 'active' : ''}`}
        >
          <LuApple className='nav-icon' size={25} />
          <span>Productos</span>
        </Link>
        
        <Link 
          to="/admin-orders" 
          className={`admin-nav-item ${isActive('/admin-orders') ? 'active' : ''}`}
        >
          <LuListOrdered className='nav-icon' size={25} />
          <span>Órdenes</span>
        </Link>
        
        <Link 
          to="/admin-users" 
          className={`admin-nav-item ${isActive('/admin-users') ? 'active' : ''}`}
        >
          <LuUsers className='nav-icon' size={25} />
          <span>Usuarios</span>
        </Link>
        
        <Link 
          to="/admin-account" 
          className={`admin-nav-item ${isActive('/admin-account') ? 'active' : ''}`}
        >
          <LuSettings className='nav-icon' size={25} />
          <span>Cuenta</span>
        </Link>
      </div>
    </nav>
  );
}

export default NavAdmin;