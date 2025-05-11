import React, { useState, useRef } from 'react'; 
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import Lottie from 'react-lottie'; // animaciones gratis, porque por qué no
import successAnimation from '../../../assets/Animation2.json'; // el super archivo de la victoria
import './Checkout.css';

function Checkout() {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const { cartItems = [] } = location.state || {}; // loot obtenido de la pantalla anterior

  // Estados de la NASA
  const [deliveryMethod, setDeliveryMethod] = useState('standard'); // modo tortuga de entrega
  const [paymentMethod, setPaymentMethod] = useState('credit-card'); // método de darle mi plata
  const [promoCode, setPromoCode] = useState(''); // código secreto que nadie usa
  const [appliedPromo, setAppliedPromo] = useState(null); // si tienes suerte aplicas uno
  const [selectedAddress, setSelectedAddress] = useState(null); // donde se supone que vivo
  const [isOrderPlaced, setIsOrderPlaced] = useState(false); // si ya apreté el botón
  const [showAnimation, setShowAnimation] = useState(false); // dibujitos felices

  // Configuración nerd para Lottie
  const defaultOptions = {
    loop: false, // porque nadie quiere ver el mismo loop 50 veces
    autoplay: true, // porque darle play es muy difícil
    animationData: successAnimation, // dibujitos
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice' // no dejes que los dibujos engorden
    }
  };

  // Direcciones inventadas
  const userAddresses = [
    {
      id: 1,
      name: 'Home', // donde procrastino
      street: '123 Main St', // calle más genérica imposible
      city: 'New York', // obvio, la ciudad cliché
      state: 'NY',
      zip: '10001',
      country: 'USA',
      isDefault: true // porque nunca cambiamos esto
    },
    {
      id: 2,
      name: 'Work', // donde finjo ser productivo
      street: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zip: '10002',
      country: 'USA',
      isDefault: false // claramente menos importante
    }
  ];

  // Opciones de cómo me roban el dinero
  const paymentMethods = [
    { id: 'credit-card', name: 'Credit Card', icon: '💳' }, // deuda instantánea
    { id: 'paypal', name: 'PayPal', icon: '🔵' }, // el monopolio azul
    { id: 'bank-transfer', name: 'Bank Transfer', icon: '🏦' } // esperando 3 días laborales
  ];

  // Opciones de cómo me llega el paquete
  const deliveryOptions = [
    { id: 'standard', name: 'Standard Delivery', price: 0, days: '3-5' }, // modo lento
    { id: 'express', name: 'Express Delivery', price: 5.99, days: '1-2' }, // pagas por ansiedad
    { id: 'pickup', name: 'Store Pickup', price: 0, days: 'Same day' } // hazlo tú mismo
  ];

  // Matemáticas de super genios
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * (item.selectedQuantity || 1)); // precio x cantidad (obvio)
    }, 0);
  };

  // Suma total, descuentos ilusorios y delivery inflado
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryCost = deliveryOptions.find(d => d.id === deliveryMethod)?.price || 0;
    const discount = appliedPromo?.discount || 0;
    return (subtotal + deliveryCost - discount).toFixed(2); // mágicamente en dos decimales
  };

  // Magia negra para aplicar un código de descuento
  const handleApplyPromo = () => {
    const validPromos = {
      'SAVE10': { discount: 10, message: '10% discount applied' }, // porque 10 suena profesional
      'FREESHIP': { discount: 5.99, message: 'Free shipping applied' } // gratis (mentira)
    };

    if (validPromos[promoCode]) {
      setAppliedPromo(validPromos[promoCode]);
    } else {
      alert('Invalid promo code'); // fracasaste
    }
  };

  // Sacrificio ritual para finalizar la orden
  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert('Please select a delivery address'); // olvidas cosas básicas
      return;
    }
    setIsOrderPlaced(true); // cambio de fase
    setShowAnimation(true); // dibujitos al ataque

    setTimeout(() => {
      navigate('/'); // adiós, checkout
    }, 2550); // precisión suiza
  };

  // Si ya ordenaste, muestra dibujitos
  if (isOrderPlaced) {
    return (
      <div className="order-confirmation">
        {showAnimation && (
          <>
            <Lottie 
              options={defaultOptions}
              height={300}
              width={300}
              eventListeners={[
                {
                  eventName: 'complete',
                  callback: () => setShowAnimation(false), // misión cumplida
                },
              ]}
            />
            <h2>¡Orden completada con éxito!</h2> 
            <p>Redirigiendo a la página principal...</p>
          </>
        )}
      </div>
    );
  }

  // Checkout de los mortales
  return (
    <div className="checkout-page-container">
      <div className="checkout-container">
        <h1>Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart-message">
            <p>Your cart is empty</p> {/* RIP tu billetera */}
            <Link to="/" className="continue-shopping-btn">
              Continue Shopping {/* vete a gastar */}
            </Link>
          </div>
        ) : (
          <div className="checkout-content">
            <div className="checkout-sections">
              
              {/* Dónde quieres que te llegue la cosa */}
              <section className="checkout-section">
                <h2>Delivery Address</h2>
                <div className="address-options">
                  {userAddresses.map(address => (
                    <div 
                      key={address.id} 
                      className={`address-card ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <h3>{address.name} {address.isDefault && '(Default)'}</h3>
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.zip}</p>
                      <p>{address.country}</p>
                    </div>
                  ))}
                  <button className="add-new-address">
                    + Add New Address {/* botón decorativo */}
                  </button>
                </div>
              </section>
              
              {/* Cómo quieres sufrir esperando tu pedido */}
              <section className="checkout-section">
                <h2>Delivery Method</h2>
                <div className="delivery-options">
                  {deliveryOptions.map(option => (
                    <div 
                      key={option.id} 
                      className={`delivery-option ${deliveryMethod === option.id ? 'selected' : ''}`}
                      onClick={() => setDeliveryMethod(option.id)}
                    >
                      <input 
                        type="radio" 
                        id={option.id}
                        name="deliveryMethod"
                        checked={deliveryMethod === option.id}
                        onChange={() => {}} // inútil
                      />
                      <label htmlFor={option.id}>
                        <span className="option-name">{option.name}</span>
                        <span className="option-details">{option.days} business days</span>
                        <span className="option-price">
                          {option.price > 0 ? `$${option.price.toFixed(2)}` : 'Free'}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </section>
              
              {/* Cómo vas a llorar después al ver tu estado de cuenta */}
              <section className="checkout-section">
                <h2>Payment Method</h2>
                <div className="payment-options">
                  {paymentMethods.map(method => (
                    <div 
                      key={method.id} 
                      className={`payment-option ${paymentMethod === method.id ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <input 
                        type="radio" 
                        id={`payment-${method.id}`}
                        name="paymentMethod"
                        checked={paymentMethod === method.id}
                        onChange={() => {}} // también inútil
                      />
                      <label htmlFor={`payment-${method.id}`}>
                        <span className="payment-icon">{method.icon}</span>
                        <span className="payment-name">{method.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </section>
              
              {/* Descuentos imaginarios */}
              <section className="checkout-section">
                <h2>Promo Code</h2>
                <div className="promo-code-input">
                  <input 
                    type="text" 
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button onClick={handleApplyPromo}>Apply</button>
                </div>
                {appliedPromo && (
                  <div className="promo-applied">
                    <span>{appliedPromo.message}</span>
                    <span>-${appliedPromo.discount.toFixed(2)}</span>
                  </div>
                )}
              </section>
            </div>

            {/* Tu cuenta de la tristeza */}
            <div className="order-summary">
              <h2>Order Summary</h2>

              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.selectedQuantity || 1}</span>
                    </div>
                    <div className="item-price">
                      ${(item.price * (item.selectedQuantity || 1)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>

                <div className="total-row">
                  <span>Delivery</span>
                  <span>
                    {deliveryOptions.find(d => d.id === deliveryMethod)?.price > 0 
                      ? `$${deliveryOptions.find(d => d.id === deliveryMethod)?.price.toFixed(2)}` 
                      : 'Free'}
                  </span>
                </div>

                {appliedPromo && (
                  <div className="total-row discount">
                    <span>Discount</span>
                    <span>-${appliedPromo.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>

              <button 
                className="place-order-btn"
                onClick={handlePlaceOrder}
              >
                Place Order {/* aquí es donde lloras */}
              </button>

              <p className="terms-agreement">
                By placing an order you agree to our <strong>Terms And Conditions</strong> {/* que no leíste */}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout; // exportando el caos
