import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/Products/ProductCard';
import './Home.css';
import SearchBar from '../components/Search Bar/Search'; 
function Home({ onAddToCart, cartItems }) {
  // Datos de ejemplo con URLs de imágenes
  const featuredProducts = [
    {
      id: 1,
      name: "Organic Bananas",
      quantity: "7pcs",
      unit: "Priceg",
      price: "4.99",
      imageUrl: "https://i.imgur.com/6FpegJL.png"
    },
    {
      id: 2,
      name: "Organic Apples",
      quantity: "1kg",
      unit: "Priceg",
      price: "3.49",
      imageUrl: "https://i.imgur.com/6FpegJL.png"
    },
    {
      id: 3,
      name: "Avocados",
      quantity: "3pcs",
      unit: "Priceg",
      price: "2.99",
      imageUrl: "https://i.imgur.com/6FpegJL.png"
    }
  ];

  return (
    <div className="home-container">

      <SearchBar />
      <h1>Bienvenido a Tochi</h1>
      <p>Descubre nuestros productos exclusivos y ofertas especiales.</p>
      
      <div className="featured-products">
        <h2>Productos Destacados</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              isInCart={cartItems.some(item => item.id === product.id)}
            />
          ))}
        </div>
      </div>
      
      <Link to="/shop" className="shop-now-btn">
        Comprar ahora
      </Link>
    </div>
  );
}

export default Home;