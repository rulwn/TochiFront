import React from 'react';
import { LuShoppingCart } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart({ cartItems = [], onUpdateCart = () => {} }) {
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const product = cartItems.find(item => item.id === productId);
    if (product) {
      onUpdateCart({...product, selectedQuantity: newQuantity}, true);
    }
  };

  const handleRemoveItem = (productId) => {
    const product = cartItems.find(item => item.id === productId);
    if (product) {
      onUpdateCart(product, false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * (item.selectedQuantity || 1));
    }, 0).toFixed(2);
  };

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
              <h1>Cart</h1>
            </div>
            
            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image-container">
                    <img 
                      src={item.imageUrl || 'https://via.placeholder.com/50x50?text=No+Image'} 
                      alt={item.name} 
                      className="item-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                      }}
                    />
                  </div>
                  
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{item.quantity && `${item.quantity}, `}{item.unit}</p>
                  </div>
                  
                  <div className="item-quantity">
                    <button 
                      onClick={() => handleQuantityChange(item.id, (item.selectedQuantity || 1) - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span>{item.selectedQuantity || 1}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, (item.selectedQuantity || 1) + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="item-price">
                    ${(item.price * (item.selectedQuantity || 1)).toFixed(2)}
                  </div>
                  
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="remove-item-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-total">
              <span>Total:</span>
              <span>${calculateTotal()}</span>
            </div>
            
            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;