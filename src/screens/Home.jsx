import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css' // Opcional, si quieres estilos

function Home() {
  return (
    <div className="home-container">
      <h1>Bienvenido a Tochi</h1>
      <p>Descubre nuestros productos exclusivos y ofertas especiales.</p>
      <div className="featured-products">
        <h2>Productos Destacados</h2>
        <div className="products-grid">
          {/* Aquí irían tus productos */}
          <div className="product-card">Producto 1</div>
          <div className="product-card">Producto 2</div>
          <div className="product-card">Producto 3</div>
        </div>
      </div>
      <Link to="/shop" className="shop-now-btn">
        Comprar ahora
      </Link>
    </div>
  )
}

export default Home
