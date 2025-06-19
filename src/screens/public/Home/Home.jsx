// Importación de bibliotecas y componentes necesarios
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../../components/Products/ProductCard';
import CategoriesCard from '../../../components/Products/CategoriesCard';
import SearchBar from '../../../components/Search Bar/Search'; 
import Carousel from '../../../components/Carousel/Carousel';
import useProducts from '../../public/Products/hook/useProducts';
import useCategories from '../../../components/Search Bar/hook/useCategories';
import useCart from '../../../screens/public/Cart/hook/useCart';
import './Home.css';

// Componente principal Home
function Home() {
  // Estado para controlar el loading del botón "Explorar Productos"
  const [isLoading, setIsLoading] = useState(false);
  
  // Hooks para obtener datos del backend
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Hook del carrito
  const { addToCart, isInCart, getProductQuantity } = useCart();
  
  // Estados para productos filtrados
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [freshProducts, setFreshProducts] = useState([]);

  // Efecto para filtrar productos cuando se cargan
  useEffect(() => {
    if (products.length > 0) {
      // Productos destacados: primeros 10 productos
      setFeaturedProducts(products.slice(0, 10));
      
      // Productos frescos: solo categoría "Vegetales" (buscar por nombre de categoría)
      // Primero necesitamos encontrar el ID de la categoría "Vegetales"
      const vegetablesCategory = categories.find(cat => 
        cat.name.toLowerCase().includes('vegetal') || 
        cat.name.toLowerCase().includes('verdura')
      );
      
      if (vegetablesCategory) {
        const vegetableProducts = products.filter(product => 
          product.categoryId === vegetablesCategory.id
        );
        setFreshProducts(vegetableProducts.slice(0, 10));
      } else {
        // Si no encontramos categoría de vegetales, mostrar productos aleatorios
        setFreshProducts(products.slice(5, 15));
      }
    }
  }, [products, categories]);

  // Manejador para añadir productos al carrito
  const handleAddToCart = async (product) => {
    await addToCart(product);
  };

  // Manejador de clic para el botón "Explorar Productos"
  const handleShopNowClick = (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del enlace
    setIsLoading(true); // Activa el estado de loading
    // Simula un retraso antes de redirigir
    setTimeout(() => {
      window.location.href = '/explore'; // Redirección a la página de exploración
    }, 800);
  };

  // Mostrar loading si aún se están cargando los datos
  if (productsLoading || categoriesLoading) {
    return (
      <div className="home-container">
        <SearchBar />
        <br />
        <br />
        <Carousel/>
        <br />
        <div className="loading-container">
          <div className="loading-spinner-large"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si hay algún problema
  if (productsError || categoriesError) {
    return (
      <div className="home-container">
        <SearchBar />
        <br />
        <br />
        <Carousel/>
        <br />
        <div className="error-container">
          <p>Error al cargar los datos: {productsError || categoriesError}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

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
            {/* Mapeo de productos destacados desde el backend */}
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard
                  key={product.id} // Clave única para cada producto
                  product={product} // Datos del producto
                  onAddToCart={handleAddToCart} // Función para añadir al carrito
                  // Verifica si el producto ya está en el carrito
                  isInCart={isInCart(product.id)}
                  // Cantidad actual del producto en el carrito
                  cartQuantity={getProductQuantity(product.id)}
                />
              ))
            ) : (
              <div className="no-products-message">
                <p>No hay productos destacados disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección de categorías */}
      <div className="categories-section">
        <h2>Explora por Categorías</h2>
        {/* Grid de categorías */}
        <div className="categories-grid">
          {/* Mapeo de categorías desde el backend */}
          {categories.length > 0 ? (
            categories.map((category, index) => (
              // Enlace a la página de categoría específica
              <Link to={`/category/${category.id}`} key={category.id}>
                <CategoriesCard
                  categoryName={category.name} // Nombre de la categoría
                  imageUrl={category.imageUrl} // Imagen de la categoría
                  index={index} // Índice para estilos únicos
                />
              </Link>
            ))
          ) : (
            <div className="no-categories-message">
              <p>No hay categorías disponibles</p>
            </div>
          )}
        </div>
      </div>
      <br />
      
      {/* Sección de productos frescos (categoría vegetales) */}
      <div className="featured-products">
        <h2>Productos Frescos</h2>
        <div className="products-scroll-container">
          <div className="products-scroll">
            {freshProducts.length > 0 ? (
              freshProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  isInCart={isInCart(product.id)}
                  cartQuantity={getProductQuantity(product.id)}
                />
              ))
            ) : (
              <div className="no-products-message">
                <p>No hay productos frescos disponibles</p>
              </div>
            )}
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