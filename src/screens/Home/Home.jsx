
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/Products/ProductCard';
import CategoriesCard from '../../components/Products/CategoriesCard';
import SearchBar from '../../components/Search Bar/Search'; 
import Carousel from '../../components/Carousel/Carousel';
import './Home.css';
import { featuredProducts, categories } from '../../assets/mockProps/mocks';

function Home({ onAddToCart, cartItems }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleShopNowClick = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = '/explore';
    }, 800);
  };

  return (
    <div className="home-container">
      <SearchBar />
      <br />
      <br />  
      <Carousel/>
      <br />
      
      {/* Sección de productos destacados con scroll horizontal */}
      <div className="featured-products">
        <h2>Productos Destacados</h2>
        <div className="products-scroll-container">
          <div className="products-scroll">
            {featuredProducts.slice(0, 10).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                isInCart={cartItems.some(item => item.id === product.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sección de categorías */}
      <div className="categories-section">
        <h2>Explora por Categorías</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <Link to={`/category/${category.id}`} key={category.id}>
              <CategoriesCard
                categoryName={category.name}
                imageUrl={category.imageUrl}
                index={index}
              />
            </Link>
          ))}
        </div>
      </div>
      <br />
      
      {/* Sección de productos frescos con scroll horizontal */}
      <div className="featured-products">
        <h2>Productos Frescos</h2>
        <div className="products-scroll-container">
          <div className="products-scroll">
            {featuredProducts.slice(0, 10).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                isInCart={cartItems.some(item => item.id === product.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="shop-now-container">
        <Link 
          to="/explore" 
          className="shop-now-btn"
          onClick={handleShopNowClick}
        >
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            'Explorar Productos'
          )}
        </Link>
      </div>
    </div>
  );
}

export default Home;