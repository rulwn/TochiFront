import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/Products/ProductCard';
import CategoriesCard from '../../components/Products/CategoriesCard';
import './Home.css';

function Home({ onAddToCart, cartItems }) {
  // Datos de productos destacados
  const featuredProducts = [
    {
      id: 1,
      name: "Bell Pepper Red",
      quantity: "No",
      unit: "Price",
      price: 4.99,
      imageUrl: "https://i.imgur.com/6FpegJL.png"
    },
    {
      id: 2,
      name: "Egg Chicken Red",
      quantity: "Spec",
      unit: "Price",
      price: 1.99,
      imageUrl: "https://i.imgur.com/6FpegJL.png"
    },
    {
      id: 3,
      name: "Organic Bananas",
      quantity: "Dkg",
      unit: "Price",
      price: 3.00,
      imageUrl: "https://i.imgur.com/6FpegJL.png"
    },
    {
      id: 4,
      name: "Ginger",
      quantity: "250gm",
      unit: "Price",
      price: 2.99,
      imageUrl: "https://i.imgur.com/6FpegJL.png"
    }
  ];

  // Datos de categorías
  const categories = [
    {
      id: 1,
      name: "Frutas",
      imageUrl: "https://png.pngtree.com/png-vector/20240709/ourmid/pngtree-fruit-varieties-png-image_13034530.png"
    },
    {
      id: 2,
      name: "Verduras",
      imageUrl: "https://static.vecteezy.com/system/resources/previews/048/051/154/non_2x/a-circular-arrangement-of-vegetables-and-fruits-transparent-background-png.png"
    },
    {
      id: 3,
      name: "Lácteos",
      imageUrl: "https://static.vecteezy.com/system/resources/previews/050/590/571/non_2x/a-variety-of-dairy-products-including-milk-cheese-and-butter-free-png.png"
    },
    {
      id: 4,
      name: "Carnes",
      imageUrl: "https://png.pngtree.com/png-clipart/20240508/original/pngtree-different-kind-of-meat-products-png-image_15044753.png"
    }
  ];

  return (
    <div className="home-container">
      <h1>Bienvenido a Tochi</h1>
      <p>Descubre nuestros productos exclusivos y ofertas especiales.</p>

      {/* Sección de productos destacados */}
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

      {/* Nueva sección de categorías */}
      <div className="categories-section">
        <h2>Explora por Categorías</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <Link to={`/category/${category.id}`} key={category.id}>
              <CategoriesCard
                categoryName={category.name}
                imageUrl={category.imageUrl}
                index={index} // Pasa el índice para el color rotativo
              />
            </Link>
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