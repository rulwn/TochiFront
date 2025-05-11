// Importación de bibliotecas y componentes necesarios
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../../components/Products/ProductCard';
import CategoriesCard from '../../../components/Products/CategoriesCard';
import SearchBar from '../../../components/Search Bar/Search'; 
import Carousel from '../../../components/Carousel/Carousel';
import './Home.css';
import { featuredProducts, categories } from '../../../assets/mockProps/mocks';

// Componente principal Home que recibe props para manejar el carrito
function Home({ onAddToCart, cartItems }) {
  // Estado para controlar el loading del botón "Explorar Productos"
  const [isLoading, setIsLoading] = useState(false);

  // Manejador de clic para el botón "Explorar Productos"
  const handleShopNowClick = (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del enlace
    setIsLoading(true); // Activa el estado de loading
    // Simula un retraso antes de redirigir
    setTimeout(() => {
      window.location.href = '/explore'; // Redirección a la página de exploración
    }, 800);
  };

  return (
    <div className="home-container">
      {/* Barra de búsqueda */}
      <SearchBar />
      <br />
      <br />  
      
      {/* Componente del carrusel */}
      <Carousel/>
      <br />
      
      {/* Sección de productos destacados */}
      <div className="featured-products">
        <h2>Productos Destacados</h2>
        {/* Contenedor con scroll horizontal */}
        <div className="products-scroll-container">
          <div className="products-scroll">
            {/* Mapeo de los primeros 10 productos destacados */}
            {featuredProducts.slice(0, 10).map(product => (
              <ProductCard
                key={product.id} // Clave única para cada producto
                product={product} // Datos del producto
                onAddToCart={onAddToCart} // Función para añadir al carrito
                // Verifica si el producto ya está en el carrito
                isInCart={cartItems.some(item => item.id === product.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sección de categorías */}
      <div className="categories-section">
        <h2>Explora por Categorías</h2>
        {/* Grid de categorías */}
        <div className="categories-grid">
          {/* Mapeo de todas las categorías */}
          {categories.map((category, index) => (
            // Enlace a la página de categoría específica
            <Link to={`/category/${category.id}`} key={category.id}>
              <CategoriesCard
                categoryName={category.name} // Nombre de la categoría
                imageUrl={category.imageUrl} // Imagen de la categoría
                index={index} // Índice para estilos únicos
              />
            </Link>
          ))}
        </div>
      </div>
      <br />
      
      {/* Sección de productos frescos (similar a productos destacados) */}
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

      {/* Botón "Explorar Productos" con manejo de estado de loading */}
      <div className="shop-now-container">
        <Link 
          to="/explore" 
          className="shop-now-btn"
          onClick={handleShopNowClick}
        >
          {/* Muestra spinner si está cargando, sino muestra el texto */}
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