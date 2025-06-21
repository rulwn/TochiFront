import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../../../components/Products/ProductCard';
import SearchBar from '../../../components/Search Bar/Search';
import useProducts from '../../public/Products/hook/useProducts';
import useCategories from '../../../components/Search Bar/hook/useCategories';
import useCart from '../../../screens/public/Cart/hook/useCart';
import './CategoryPage.css';

function CategoryPage() {
  const { categoryId } = useParams();
  
  // Hooks para obtener datos
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { addToCart, isInCart, getProductQuantity } = useCart();
  
  // Estados locales
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [sortBy, setSortBy] = useState('name');

  // Obtener la categoría actual y filtrar productos
  useEffect(() => {
    if (categories.length > 0 && categoryId) {
      const category = categories.find(cat => cat.id.toString() === categoryId.toString());
      setCurrentCategory(category);
    }
  }, [categories, categoryId]);

  // Filtrar productos por categoría
  useEffect(() => {
    if (products.length > 0 && categoryId) {
      const filtered = products.filter(product => 
        product.categoryId?.toString() === categoryId.toString()
      );
      setCategoryProducts(filtered);
      setFilteredProducts(filtered);
    }
  }, [products, categoryId]);

  // Filtrar por búsqueda y ordenar
  useEffect(() => {
    let results = [...categoryProducts];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      results = results.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Ordenar productos
    results.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'stock':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

    setFilteredProducts(results);
  }, [categoryProducts, searchTerm, sortBy]);

  // Manejadores
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleAddToCart = async (product) => {
    await addToCart(product);
  };

  // Estados de carga y error
  if (productsLoading || categoriesLoading) {
    return (
      <div className="category-page-container">
        <div className="category-page-loading">
          <div className="category-page-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (productsError || categoriesError) {
    return (
      <div className="category-page-container">
        <div className="category-page-error">
          <h2>Error al cargar los productos</h2>
          <p>{productsError || categoriesError}</p>
          <Link to="/" className="category-page-back-button">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="category-page-container">
        <div className="category-page-not-found">
          <h2>Categoría no encontrada</h2>
          <p>La categoría que buscas no existe o ha sido eliminada.</p>
          <Link to="/" className="category-page-back-button">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page-container">
      {/* Header de la categoría */}
      <div className="category-page-header">
        <div className="category-page-breadcrumb">
          <Link to="/" className="category-page-breadcrumb-link">Inicio</Link>
          <span className="category-page-breadcrumb-separator">/</span>
          <span className="category-page-breadcrumb-current">Categorías</span>
          <span className="category-page-breadcrumb-separator">/</span>
          <span className="category-page-breadcrumb-current">{currentCategory.name}</span>
        </div>
        
        <div className="category-page-title-section">
          <h1 className="category-page-title">{currentCategory.name}</h1>
          <p className="category-page-subtitle">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} disponible{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="category-page-toolbar">
        <div className="category-page-search-container">
          <SearchBar onSearch={handleSearch} placeholder={`Buscar en ${currentCategory.name}...`} />
        </div>
        
        <div className="category-page-filters">
          <div className="category-page-sort-container">
            <label htmlFor="sort-select" className="category-page-sort-label">
              Ordenar por:
            </label>
            <select 
              id="sort-select"
              value={sortBy} 
              onChange={handleSortChange}
              className="category-page-sort-select"
            >
              <option value="name">Nombre (A-Z)</option>
              <option value="price-low">Precio (Menor a Mayor)</option>
              <option value="price-high">Precio (Mayor a Menor)</option>
              <option value="stock">Más Disponibles</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mensaje de búsqueda */}
      {searchTerm && (
        <div className="category-page-search-info">
          <p>
            Mostrando resultados para "<strong>{searchTerm}</strong>" en {currentCategory.name}
            <button 
              onClick={() => setSearchTerm('')}
              className="category-page-clear-search"
            >
              Limpiar búsqueda
            </button>
          </p>
        </div>
      )}

      {/* Grid de productos */}
      <div className="category-page-products-section">
        {filteredProducts.length > 0 ? (
          <div className="category-page-products-grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isInCart={isInCart(product.id)}
                cartQuantity={getProductQuantity(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="category-page-no-results">
            <div className="category-page-no-results-icon">📦</div>
            <h3>No se encontraron productos</h3>
            <p>
              {searchTerm 
                ? `No hay productos que coincidan con "${searchTerm}" en esta categoría.`
                : `No hay productos disponibles en la categoría ${currentCategory.name} en este momento.`
              }
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="category-page-clear-search-button"
              >
                Ver todos los productos de {currentCategory.name}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Botón de regreso */}
      <div className="category-page-back-section">
        <Link to="/" className="category-page-back-home">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default CategoryPage;