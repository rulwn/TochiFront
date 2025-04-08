import React from 'react';
import { FaLeaf, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="tochi-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo-container">
            <FaLeaf className="logo-icon" />
            <span className="logo-text">TOCHI</span>
          </div>
          <p className="footer-mission">
            Conexión directa entre agricultores y consumidores de productos orgánicos
          </p>
        </div>

        <div className="footer-links">
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/explore">Productos</a></li>
            <li><a href="/about">Nosotros</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <ul>
            <li><a href="/contact">Contacto</a></li>
            <li><a href="/termsAndConditions">Términos</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-social">
        <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
        <a href="https://facebook.com" aria-label="Facebook"><FaFacebook /></a>
        <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Tochi. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;