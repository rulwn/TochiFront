import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import Lottie from 'react-lottie';
import successAnimation from '../../../assets/Animation2.json';
import useCheckout from './hook/useCheckout'; 
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate(); 
  const {
    cartItems,
    cartTotal,
    hasItems,
    canProceedToCheckout,
    processCheckout,
    isProcessing,
    orderCreated,
    resetCheckout
  } = useCheckout();

  // Estados locales del componente
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Configuración para Lottie
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  // Direcciones del usuario (esto puede venir de un contexto o API)
  const userAddresses = [
    {
      id: 1,
      name: 'Home',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
      isDefault: true
    },
    {
      id: 2,
      name: 'Work',
      street: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zip: '10002',
      country: 'USA',
      isDefault: false
    }
  ];

  // Métodos de pago disponibles
  const paymentMethods = [
    { id: 'credit-card', name: 'Credit Card', icon: '💳' },
    { id: 'paypal', name: 'PayPal', icon: '🔵' },
    { id: 'wompi', name: 'Wompi', icon: '💰' },
    { id: 'payphone', name: 'Payphone', icon: '📱' }
  ];

  // Opciones de entrega
  const deliveryOptions = [
    { id: 'standard', name: 'Standard Delivery', price: 0, days: '3-5' },
    { id: 'express', name: 'Express Delivery', price: 5.99, days: '1-2' },
    { id: 'pickup', name: 'Store Pickup', price: 0, days: 'Same day' }
  ];

  // Seleccionar dirección por defecto al cargar
  useEffect(() => {
    const defaultAddress = userAddresses.find(addr => addr.isDefault);
    if (defaultAddress && !selectedAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, [userAddresses, selectedAddress]);

  // Calcular subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * (item.selectedQuantity || 1));
    }, 0);
  };

  // Obtener costo de delivery
  const getDeliveryCost = () => {
    return deliveryOptions.find(d => d.id === deliveryMethod)?.price || 0;
  };

  // Calcular total final
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryCost = getDeliveryCost();
    const discount = appliedPromo?.discount || 0;
    return (subtotal + deliveryCost - discount);
  };

  // Aplicar código promocional
  const handleApplyPromo = () => {
    const validPromos = {
      'SAVE10': { discount: calculateSubtotal() * 0.1, message: '10% discount applied' },
      'FREESHIP': { discount: getDeliveryCost(), message: 'Free shipping applied' },
      'SAVE20': { discount: calculateSubtotal() * 0.2, message: '20% discount applied' }
    };

    if (validPromos[promoCode.toUpperCase()]) {
      setAppliedPromo(validPromos[promoCode.toUpperCase()]);
      setFormErrors({ ...formErrors, promoCode: null });
    } else {
      setFormErrors({ ...formErrors, promoCode: 'Código promocional inválido' });
      setAppliedPromo(null);
    }
  };

  // Validar formulario antes de procesar
  const validateForm = () => {
    const errors = {};

    if (!selectedAddress) {
      errors.address = 'Debe seleccionar una dirección de entrega';
    }

    if (!paymentMethod) {
      errors.payment = 'Debe seleccionar un método de pago';
    }

    if (!deliveryMethod) {
      errors.delivery = 'Debe seleccionar un método de entrega';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Procesar la orden
  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    if (!canProceedToCheckout) {
      alert('No se puede proceder con el checkout. Verifique que tenga items en el carrito y esté logueado.');
      return;
    }

    const checkoutData = {
      deliveryAddress: selectedAddress,
      paymentMethod: paymentMethod,
      deliveryMethod: deliveryMethod,
      deliveryCost: getDeliveryCost(),
      appliedDiscount: appliedPromo?.discount || 0,
      finalTotal: calculateTotal(),
      promoCode: appliedPromo ? promoCode : null
    };

    const result = await processCheckout(checkoutData);

    if (result.success) {
      setShowAnimation(true);
      
      // Redirigir después de la animación
      setTimeout(() => {
        navigate('/', { 
          state: { 
            orderSuccess: true, 
            orderId: result.order._id,
            paymentId: result.paymentId 
          } 
        });
      }, 3000);
    }
  };

  // Limpiar el checkout al desmontar el componente
  useEffect(() => {
    return () => {
      resetCheckout();
    };
  }, [resetCheckout]);

  // Mostrar animación de éxito
  if (orderCreated && showAnimation) {
    return (
      <div className="order-confirmation">
        <Lottie 
          options={defaultOptions}
          height={300}
          width={300}
          eventListeners={[
            {
              eventName: 'complete',
              callback: () => setShowAnimation(false),
            },
          ]}
        />
        <h2>¡Orden completada con éxito!</h2>
        <p>Número de orden: {orderCreated._id}</p>
        <p>Total pagado: ${calculateTotal().toFixed(2)}</p>
        <p>Redirigiendo a la página principal...</p>
      </div>
    );
  }

  // Renderizar checkout
  return (
    <div className="checkout-page-container">
      <div className="checkout-container">
        <h1>Checkout</h1>

        {!hasItems ? (
          <div className="empty-cart-message">
            <p>Tu carrito está vacío</p>
            <Link to="/" className="continue-shopping-btn">
              Continuar Comprando
            </Link>
          </div>
        ) : (
          <div className="checkout-content">
            <div className="checkout-sections">
              
              {/* Sección de Dirección de Entrega */}
              <section className="checkout-section">
                <h2>Dirección de Entrega</h2>
                {formErrors.address && (
                  <div className="error-message">{formErrors.address}</div>
                )}
                <div className="address-options">
                  {userAddresses.map(address => (
                    <div 
                      key={address.id} 
                      className={`address-card ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <h3>{address.name} {address.isDefault && '(Por defecto)'}</h3>
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.zip}</p>
                      <p>{address.country}</p>
                    </div>
                  ))}
                  <button className="add-new-address">
                    + Agregar Nueva Dirección
                  </button>
                </div>
              </section>
              
              {/* Sección de Método de Entrega */}
              <section className="checkout-section">
                <h2>Método de Entrega</h2>
                {formErrors.delivery && (
                  <div className="error-message">{formErrors.delivery}</div>
                )}
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
                        onChange={() => setDeliveryMethod(option.id)}
                      />
                      <label htmlFor={option.id}>
                        <span className="option-name">{option.name}</span>
                        <span className="option-details">{option.days} días hábiles</span>
                        <span className="option-price">
                          {option.price > 0 ? `$${option.price.toFixed(2)}` : 'Gratis'}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </section>
              
              {/* Sección de Método de Pago */}
              <section className="checkout-section">
                <h2>Método de Pago</h2>
                {formErrors.payment && (
                  <div className="error-message">{formErrors.payment}</div>
                )}
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
                        onChange={() => setPaymentMethod(method.id)}
                      />
                      <label htmlFor={`payment-${method.id}`}>
                        <span className="payment-icon">{method.icon}</span>
                        <span className="payment-name">{method.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </section>
              
              {/* Sección de Código Promocional */}
              <section className="checkout-section">
                <h2>Código Promocional</h2>
                <div className="promo-code-input">
                  <input 
                    type="text" 
                    placeholder="Ingresa el código promocional"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  />
                  <button onClick={handleApplyPromo} disabled={!promoCode.trim()}>
                    Aplicar
                  </button>
                </div>
                {formErrors.promoCode && (
                  <div className="error-message">{formErrors.promoCode}</div>
                )}
                {appliedPromo && (
                  <div className="promo-applied">
                    <span>{appliedPromo.message}</span>
                    <span>-${appliedPromo.discount.toFixed(2)}</span>
                  </div>
                )}
              </section>
            </div>

            {/* Resumen de la Orden */}
            <div className="order-summary">
              <h2>Resumen de la Orden</h2>

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
                  <span>Entrega</span>
                  <span>
                    {getDeliveryCost() > 0 
                      ? `$${getDeliveryCost().toFixed(2)}` 
                      : 'Gratis'}
                  </span>
                </div>

                {appliedPromo && (
                  <div className="total-row discount">
                    <span>Descuento</span>
                    <span>-${appliedPromo.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <button 
                className="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={isProcessing || !canProceedToCheckout}
              >
                {isProcessing ? 'Procesando...' : 'Realizar Pedido'}
              </button>

              <p className="terms-agreement">
                Al realizar el pedido aceptas nuestros <strong>Términos y Condiciones</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
