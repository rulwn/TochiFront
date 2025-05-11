import React, { useState, useEffect } from 'react';
import './Products.css';
import ProductCard from '../../../components/Products/ProductCard';
import SearchBar from '../../../components/Search Bar/Search';
import Combobox from '../../../components/Search Bar/Combobox';

function Products({onAddToCart, cartItems}) {


    // Datos de ejemplo - reemplaza con tus productos reales
    const DEFAULT_IMAGE = 'https://i.imgur.com/6FpegJL.png';
    const mockProducts = [
        {
            id: 1,
            name: 'Leche Entera',
            category: 'lacteos',
            quantity: "1L",
            unit: "Price",
            price: 2.50,
            imageUrl: 'https://i.imgur.com/6FpegJL.png'
        },
        {
            id: 2,
            name: 'Queso Cheddar',
            category: 'lacteos',
            quantity: "200g",
            unit: "Price",
            price: 3.75,
            imageUrl: 'https://i.imgur.com/6FpegJL.png'
        },
        {
            id: 3,
            name: 'Leche Entera',
            category: 'lacteos',
            quantity: "1L",
            unit: "Price",
            price: 2.50,
            imageUrl: 'https://i.imgur.com/6FpegJL.png'
        },
        {
            id: 4,
            name: 'Queso Cheddar',
            category: 'lacteos',
            quantity: "200g",
            unit: "Price",
            price: 3.75,
            imageUrl: 'https://i.imgur.com/6FpegJL.png'
        },
        {
            id: 5,
            name: 'Leche Entera',
            category: 'lacteos',
            quantity: "1L",
            unit: "Price",
            price: 2.50,
            imageUrl: 'https://i.imgur.com/6FpegJL.png'
        },
        {
            id: 6,
            name: 'Queso Cheddar',
            category: 'lacteos',
            quantity: "200g",
            unit: "Price",
            price: 3.75,
            imageUrl: 'https://i.imgur.com/6FpegJL.png'
        },
        {
            id: 7,
            name: 'Leche Entera',
            category: 'lacteos',
            quantity: "1L",
            unit: "Price",
            price: 2.50,
            imageUrl: 'https://i.imgur.com/6FpegJL.png'
        },
        {
            id: 8,
            name: 'Queso Cheddar',
            category: 'lacteos',
            quantity: "200g",
            unit: "Price",
            price: 3.75,
            imageUrl: 'https://i.imgur.com/6FpegJL.png'
        },
        {
            id: 9,
            name: 'Leche Entera',
            category: 'lacteos',
            quantity: "1L",
            unit: "Price",
            price: 2.50,
            imageUrl: 'https://i.imgur.com/6FpegJL.png'
        },
        {
            id: 10,
            name: 'Queso Cheddar',
            category: 'lacteos',
            quantity: "200g",
            unit: "Price",
            price: 3.75,
            imageUrl: 'https://i.imgur.com/6FpegJL.png'
        },
    ];


    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('todos');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const safeProducts = mockProducts.map(p => ({
            id: p?.id || Math.random().toString(36).substr(2, 9),
            name: p?.name || 'Producto sin nombre',
            category: p?.category || 'otros',
            price: typeof p?.price === 'number' ? p.price : 0,
            imageUrl: p?.imageUrl || DEFAULT_IMAGE
        }));

        let results = [...safeProducts];

        if (selectedCategory !== 'todos') {
            results = results.filter(p => p.category === selectedCategory);
        }

        if (searchTerm) {
            results = results.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProducts(results);
    }, [searchTerm, selectedCategory]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

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
                        filteredProducts.map(product => ({
                            ...product,
                            imageUrl: product.imageUrl || DEFAULT_IMAGE,
                            quantity: product.quantity || "", // Asegurar que tenga quantity
                            unit: product.unit || "Price" // Asegurar que tenga unit
                        })).map(product => (
                            <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={onAddToCart}
                            isInCart={cartItems.some(item => item.id === product.id)}
                            />
                        ))
                    ) : (
                        <p className="no-results">No se encontraron productos que coincidan con tu búsqueda.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Products;