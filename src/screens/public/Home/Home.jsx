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

// Categorías predeterminadas con sus imágenes
const DEFAULT_CATEGORIES = {
  'cuidado personal': {
    id: 'cuidado-personal',
    name: 'Cuidado Personal',
    imageUrl: 'https://png.pngtree.com/png-vector/20240903/ourmid/pngtree-a-set-of-personal-care-items-toothbrushes-toothpaste-shampoo-and-bath-png-image_13738435.png'
  },
  'alimentos': {
    id: 'alimentos',
    name: 'Alimentos',
    imageUrl: 'https://www.adolescenciasema.org/wp-content/uploads/2023/05/verduras-corazon-adolescente-1.png'
  },
  'frutas': {
    id: 'frutas',
    name: 'Frutas',
    imageUrl: 'https://png.pngtree.com/png-vector/20240709/ourmid/pngtree-fruit-varieties-png-image_13034530.png'
  },
  'vegetal': {
    id: 'vegetal',
    name: 'Vegetales',
    imageUrl: 'https://static.vecteezy.com/system/resources/previews/048/051/154/non_2x/a-circular-arrangement-of-vegetables-and-fruits-transparent-background-png.png'
  }
};

// Imagen por defecto si no se encuentra coincidencia
const DEFAULT_IMAGE = 'https://via.placeholder.com/300x200?text=Categoría';

// Función para obtener imagen predeterminada basada en el nombre
const getCategoryImage = (categoryName) => {
  if (!categoryName) return DEFAULT_IMAGE;
  
  // Normalizar el nombre: convertir a minúsculas y quitar espacios extra
  const normalizedName = categoryName.toLowerCase().trim();
  
  // Buscar coincidencia exacta
  if (DEFAULT_CATEGORIES[normalizedName]) {
    return DEFAULT_CATEGORIES[normalizedName].imageUrl;
  }
  
  // Buscar coincidencia parcial
  for (const [key, category] of Object.entries(DEFAULT_CATEGORIES)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return category.imageUrl;
    }
  }
  
  return DEFAULT_IMAGE;
};

// Función para procesar categorías y añadir imágenes predeterminadas
const processCategories = (categories) => {
  return categories.map(category => ({
    ...category,
    imageUrl: category.imageUrl || getCategoryImage(category.name)
  }));
};

// Componente principal Home
function Home() {
  // Estado para controlar el loading del botón "Explorar Productos"
  const [isLoading, setIsLoading] = useState(false);
  
  // Hooks para obtener datos del backend
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { categories: rawCategories, loading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Hook del carrito
  const { addToCart, isInCart, getProductQuantity } = useCart();
  
  // Estados para productos filtrados y categorías procesadas
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [freshProducts, setFreshProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Efecto para procesar categorías cuando se cargan
  useEffect(() => {
    if (rawCategories.length > 0) {
      const processedCategories = processCategories(rawCategories);
      setCategories(processedCategories);
    }
  }, [rawCategories]);

  // Efecto para filtrar productos cuando se cargan
  useEffect(() => {
    if (products.length > 0) {
      // Productos destacados: primeros 10 productos
      setFeaturedProducts(products.slice(0, 10));
      
      // Productos frescos: buscar categoría "vegetal" o "vegetales"
      const vegetablesCategory = categories.find(cat => {
        const categoryName = cat.name.toLowerCase();
        return categoryName.includes('vegetal') || 
               categoryName.includes('verdura') ||
               categoryName.includes('vegetales');
      });
      
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
          {/* Mapeo de categorías procesadas con imágenes predeterminadas */}
          {categories.length > 0 ? (
            categories.map((category, index) => (
              // Enlace a la página de categoría específica
              <Link to={`/category/${category.id}`} key={category.id}>
                <CategoriesCard
                  categoryName={category.name} // Nombre de la categoría
                  imageUrl={category.imageUrl} // Imagen predeterminada o de la BD
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