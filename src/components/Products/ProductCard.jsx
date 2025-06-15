import React, { useState } from 'react';
import { LuShoppingCart, LuCheck, LuX, LuPlus, LuMinus } from 'react-icons/lu';
import './ProductCard.css';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, isInCart }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleAddToCart = (confirmed) => {
    if (confirmed) {
      onAddToCart({ ...product, selectedQuantity: quantity }, true);
    }
    setShowDialog(false);
    setQuantity(1);
  };

  const handleRemoveFromCart = (e) => {
    e.stopPropagation();
    onAddToCart(product, false);
  };

  const handleShowDialog = (e) => {
    e.stopPropagation();
    setShowDialog(true);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const incrementQuantity = () => {
    if (quantity < 50) setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <>
      <div className="card-products-product-card">
        {/* Contenido clickeable que navega al detalle */}
        <div 
          className="card-products-product-clickable-area"
          onClick={handleCardClick}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-products-product-image-container">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/200x150?text=No+Image'}
              alt={product.name}
              className="card-products-product-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
              }}
            />
          </div>
          <div className="card-products-product-name">{product.name}</div>
          <div className="card-products-product-details">
            {product.quantity && <span>{product.quantity}</span>}
            {product.quantity && product.unit && <span>, </span>}
            {product.unit && <span>{product.unit}</span>}
          </div>
        </div>

        {/* Footer con precio y botón (no navega) */}
        <div className="card-products-product-footer">
          <div className="card-products-product-price">${product.price}</div>
          <button
            className={`card-products-add-to-cart-btn ${isInCart ? 'added' : ''}`}
            onClick={isInCart ? handleRemoveFromCart : handleShowDialog}
            aria-label={isInCart ? "Remove from cart" : "Add to cart"}
          >
            {isInCart ? <LuCheck className="card-products-cart-icon" /> : <LuShoppingCart className="card-products-cart-icon" />}
          </button>
        </div>
      </div>

      {/* Diálogo de cantidad */}
      {showDialog && (
        <div className="card-products-dialog-overlay" onClick={() => setShowDialog(false)}>
          <div className="card-products-quantity-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              className="card-products-dialog-close-btn"
              onClick={() => setShowDialog(false)}
              aria-label="Cerrar diálogo"
            >
              <LuX size={20} />
            </button>

            <h3>Selecciona la cantidad</h3>
            <p>{product.name}</p>

            <div className="card-products-quantity-selector">
              <button
                className="card-products-quantity-btn"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                aria-label="Reducir cantidad"
              >
                <LuMinus size={16} />
              </button>

              <input
                type="number"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => {
                  const value = Math.min(50, Math.max(1, parseInt(e.target.value) || 1));
                  setQuantity(value);
                }}
                className="card-products-quantity-input"
                aria-label="Cantidad de productos"
              />

              <button
                className="card-products-quantity-btn"
                onClick={incrementQuantity}
                disabled={quantity >= 50}
                aria-label="Aumentar cantidad"
              >
                <LuPlus size={16} />
              </button>
            </div>

            <div className="card-products-dialog-buttons">
              <button
                className="card-products-dialog-btn card-products-cancel-btn"
                onClick={() => setShowDialog(false)}
              >
                Cancelar
              </button>
              <button
                className="card-products-dialog-btn card-products-confirm-btn"
                onClick={() => handleAddToCart(true)}
              >
                Confirmar ({quantity})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;