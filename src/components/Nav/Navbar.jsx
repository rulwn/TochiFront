import React from 'react';
import '../Nav/Navbar.css';
import logo from '../../assets/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { LuTextSearch, LuUser, LuStore, LuShoppingCart, LuMapPin  } from "react-icons/lu";
import { MdOutlineNewspaper } from "react-icons/md";

function Navbar() {
  const location = useLocation();

  // Función para determinar si un item está activo
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="navbar">
        <div></div> 
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo Tochi" className="logo"/>
        </Link>
        <div className="location-container">
          <LuMapPin size={16} />
          <span>San Salvador</span>
        </div>
        <div className="nav-options">
            <Link 
              to="/" 
              className={`nav-item ${isActive('/') ? 'active' : ''}`}
              data-active={isActive('/')}
            >
                <LuStore className='shop-icon' size={25} />
                Shop  
            </Link>
            <Link 
              to="/explore" 
              className={`nav-item ${isActive('/explore') ? 'active' : ''}`}
            >
                <LuTextSearch className='search-icon' size={25} />
                Explore
            </Link>
            <Link 
              to="/about" 
              className={`nav-item ${isActive('/about') ? 'active' : ''}`}
            >
                <MdOutlineNewspaper className='news-icon' size={25} />
                About
            </Link>
            <Link 
              to="/cart" 
              className={`nav-item ${isActive('/cart') ? 'active' : ''}`}
            >
                <LuShoppingCart className='cart-icon' size={25} />
                Cart
            </Link>
            <Link 
              to="/account" 
              className={`nav-item ${isActive('/account') ? 'active' : ''}`}
            >
                <LuUser className='account-icon' size={25} />
                Account
            </Link>
        </div>
      </nav>    
    </>
  );
}

export default Navbar;