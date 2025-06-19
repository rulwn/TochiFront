import React from "react";
import { LuShoppingCart } from "react-icons/lu";
import { Link } from "react-router-dom";
import useCart from "./hook/useCart";
import "./Cart.css";

function Cart() {
  const { 
    cartItems, 
    total, 
    isLoading, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    getCartItemsCount 
  } = useCart();

  // Manejador para cambiar cantidad (incremento/decremento de 1)
  const handleQuantityChange = async (product, increment) => {
    await updateCartItem(product, increment);
  };

  // Manejador para eliminar producto completamente
  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  // Formatear precio
  const formatPrice = (price) => {
    return parseFloat(price || 0).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="cart-page-container">
        <div className="cart-container">
          <div className="loading-container">
            <div className="loading-spinner-large"></div>
            <p>Cargando carrito...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-container">
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <LuShoppingCart className="cart-icon-large" size={80} />
            <h1>Cart</h1>
            <p className="cart-message">Your cart is currently empty</p>
            <Link to="/" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-with-items">
            <div className="cart-header">
              <LuShoppingCart className="cart-icon-title" size={30} />
              <h1>Carrito ({getCartItemsCount()} items)</h1>
              <button 
                onClick={clearCart}
                className="clear-cart-btn"
                style={{ 
                  marginLeft: 'auto',
                  background: 'none',
                  border: '1px solid #ddd',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Vaciar
              </button>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  {/* Imagen del producto */}
                  <div className="item-image-container">
                    <img
                      src={item.imageUrl || "https://via.placeholder.com/50x50?text=No+Image"}
                      alt={item.name}
                      className="item-image"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/50x50?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Información del producto */}
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>
                      {item.quantity && `${item.quantity}`}
                      {item.unit && `, ${item.unit}`}
                    </p>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="item-quantity">
                    <button
                      onClick={() => handleQuantityChange(item, false)}
                      className="quantity-btn"
                      disabled={isLoading || (item.selectedQuantity || 1) <= 1}
                    >
                      -
                    </button>
                    <span>{item.selectedQuantity || 1}</span>
                    <button
                      onClick={() => handleQuantityChange(item, true)}
                      className="quantity-btn"
                      disabled={isLoading}
                    >
                      +
                    </button>
                  </div>

                  {/* Precio total del item */}
                  <div className="item-price">
                    ${formatPrice(item.price * (item.selectedQuantity || 1))}
                  </div>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="remove-item-btn"
                    disabled={isLoading}
                    title="Eliminar producto"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            {/* Resumen del carrito */}
            <div className="cart-summary">
              <div className="cart-total">
                <span>Subtotal ({getCartItemsCount()} items):</span>
                <span>${formatPrice(total)}</span>
              </div>
              
              <div className="shipping-info">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              
              <div className="cart-total final-total">
                <span>Total:</span>
                <span>${formatPrice(total)}</span>
              </div>
              
              <div className="cart-actions">
                <Link to="/" className="continue-shopping-link">
                  ← Continuar Comprando
                </Link>
                <Link 
                  to="/checkout" 
                  className="checkout-btn" 
                  state={{ cartItems, total }}
                >
                  Proceder al Pago
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;