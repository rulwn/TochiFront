import React, { useState } from 'react';
import { LuShoppingCart, LuCheck, LuX, LuPlus, LuMinus } from 'react-icons/lu';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, isInCart }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (confirmed) => {
    if (confirmed) {
      // Enviamos el producto con la cantidad seleccionada
      onAddToCart({...product, selectedQuantity: quantity}, true);
    }
    setShowDialog(false);
    setQuantity(1); // Resetear cantidad después de confirmar
  };

  const handleRemoveFromCart = () => {
    onAddToCart(product, false); // Indicamos que se debe quitar
  };

  const incrementQuantity = () => {
    if (quantity < 50) setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <>
      <div className="product-card">
        <div className="product-image-container">
          <img 
            src={product.imageUrl || 'https://via.placeholder.com/200x150?text=No+Image'} 
            alt={product.name} 
            className="product-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
            }}
          />
        </div>
        <div className="product-name">{product.name}</div>
        <div className="product-details">
          {product.quantity && <span>{product.quantity}</span>}
          {product.quantity && product.unit && <span>, </span>}
          {product.unit && <span>{product.unit}</span>}
        </div>
        <div className="product-footer">
          <div className="product-price">${product.price}</div>
          <button 
            className={`add-to-cart-btn ${isInCart ? 'added' : ''}`}
            onClick={isInCart ? handleRemoveFromCart : () => setShowDialog(true)}
            aria-label={isInCart ? "Remove from cart" : "Add to cart"}
          >
            {isInCart ? <LuCheck className="cart-icon" /> : <LuShoppingCart className="cart-icon" />}
          </button>
        </div>
      </div>

      {/* Diálogo de cantidad - Solo para añadir productos */}
      {showDialog && (
        <div className="dialog-overlay" onClick={() => setShowDialog(false)}>
          <div className="quantity-dialog" onClick={(e) => e.stopPropagation()}>
            <button 
              className="dialog-close-btn"
              onClick={() => setShowDialog(false)}
              aria-label="Cerrar diálogo"
            >
              <LuX size={20} />
            </button>
            
            <h3>Selecciona la cantidad</h3>
            <p>{product.name}</p>
            
            <div className="quantity-selector">
              <button 
                className="quantity-btn"
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
                className="quantity-input"
                aria-label="Cantidad de productos"
              />
              
              <button 
                className="quantity-btn"
                onClick={incrementQuantity}
                disabled={quantity >= 50}
                aria-label="Aumentar cantidad"
              >
                <LuPlus size={16} />
              </button>
            </div>
            
            <div className="dialog-buttons">
              <button 
                className="dialog-btn cancel-btn"
                onClick={() => setShowDialog(false)}
              >
                Cancelar
              </button>
              <button 
                className="dialog-btn confirm-btn"
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