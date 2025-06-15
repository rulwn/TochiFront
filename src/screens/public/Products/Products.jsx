import React, { useState, useEffect } from 'react';
import './Products.css';
import ProductCard from '../../../components/Products/ProductCard';
import SearchBar from '../../../components/Search Bar/Search';
import Combobox from '../../../components/Search Bar/Combobox';
import useProducts from './hook/useProducts'; // Ajusta la ruta según tu estructura

function Products({onAddToCart, cartItems}) {
    const DEFAULT_IMAGE = 'https://i.imgur.com/6FpegJL.png';
    
    // Usar el hook personalizado
    const { products, loading, error, refreshProducts } = useProducts();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('todos');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (products.length === 0) return;

        // Asegurar que todos los productos tengan las propiedades necesarias
        const safeProducts = products.map(p => ({
            id: p?.id || Math.random().toString(36).substr(2, 9),
            name: p?.name || 'Producto sin nombre',
            categoryId: p?.categoryId || p?.category || 'otros',
            category: p?.categoryId || p?.category || 'otros', // Para compatibilidad
            price: typeof p?.price === 'number' ? p.price : 0,
            imageUrl: p?.imageUrl || DEFAULT_IMAGE,
            description: p?.description || '',
            stock: p?.stock || 0,
            quantity: p?.quantity || '',
            unit: p?.unit || 'Price'
        }));

        let results = [...safeProducts];

        // Filtrar por categoría usando el ID de categoría
        if (selectedCategory !== 'todos') {
            results = results.filter(p => p.categoryId === selectedCategory);
        }

        // Filtrar por término de búsqueda
        if (searchTerm) {
            results = results.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredProducts(results);
    }, [products, searchTerm, selectedCategory]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    // Mostrar estado de carga
    if (loading) {
        return (
            <div className="products-container">
                <div className="loading-message">
                    <p>Cargando productos...</p>
                </div>
            </div>
        );
    }

    // Mostrar error
    if (error) {
        return (
            <div className="products-container">
                <div className="error-message">
                    <p>Error al cargar productos: {error}</p>
                    <button onClick={refreshProducts} className="retry-button">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="products-container">
            <div className="search-container">
                <div className="search-combobox-group">
                    <div className="search-wrapper">
                        <SearchBar onSearch={handleSearch} />
                    </div>
                    <div className="combobox-wrapper">
                        <Combobox onCategoryChange={handleCategoryChange} />
                    </div>
                </div>
            </div>

            <div className="products-section">
                <h2>Nuestro Catálogo</h2>
                <div className="products-grid">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={onAddToCart}
                                isInCart={cartItems.some(item => item.id === product.id)}
                            />
                        ))
                    ) : (
                        <p className="no-results">
                            {products.length === 0 
                                ? "No hay productos disponibles en este momento." 
                                : "No se encontraron productos que coincidan con tu búsqueda."
                            }
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Products;