import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';
import { FiChevronLeft, FiPlus, FiTrash2, FiChevronRight, FiChevronLeft as FiChevronLeftIcon } from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';

function PaymentMethods() {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      cardType: 'visa',
      lastFour: '4242',
      cardHolder: 'Wilfredo Granados',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 2,
      cardType: 'mastercard',
      lastFour: '5555',
      cardHolder: 'Wilfredo Granados',
      expiry: '06/24',
      isDefault: false
    },
    {
      id: 3,
      cardType: 'amex',
      lastFour: '1234',
      cardHolder: 'Wilfredo Granados',
      expiry: '09/23',
      isDefault: false
    }
  ]);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
    cardType: 'visa'
  });

  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => 
      prevIndex === paymentMethods.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevCard = () => {
    setCurrentCardIndex((prevIndex) => 
      prevIndex === 0 ? paymentMethods.length - 1 : prevIndex - 1
    );
  };

  const deleteCard = (id) => {
    if (paymentMethods.length > 1) {
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
      if (currentCardIndex >= paymentMethods.length - 1) {
        setCurrentCardIndex(paymentMethods.length - 2);
      }
    }
  };

  const setAsDefault = (id) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const handleAddPaymentMethod = () => {
    if (newPaymentMethod.cardNumber && newPaymentMethod.cardHolder && newPaymentMethod.expiry) {
      const lastFour = newPaymentMethod.cardNumber.slice(-4);
      const cardType = detectCardType(newPaymentMethod.cardNumber);
      
      setPaymentMethods([
        ...paymentMethods,
        {
          id: paymentMethods.length + 1,
          cardType,
          lastFour,
          cardHolder: newPaymentMethod.cardHolder,
          expiry: newPaymentMethod.expiry,
          isDefault: false
        }
      ]);
      
      setNewPaymentMethod({
        cardNumber: '',
        cardHolder: '',
        expiry: '',
        cvv: '',
        cardType: 'visa'
      });
      
      setShowAddForm(false);
      setCurrentCardIndex(paymentMethods.length); // Muestra la nueva tarjeta
    }
  };

  const detectCardType = (number) => {
    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    return 'visa';
  };

  const renderCardIcon = (type) => {
    switch(type) {
      case 'visa': return <FaCcVisa className="card-brand-icon" />;
      case 'mastercard': return <FaCcMastercard className="card-brand-icon" />;
      case 'amex': return <FaCcAmex className="card-brand-icon" />;
      default: return <FaCcVisa className="card-brand-icon" />;
    }
  };

  return (
    <div className="payment-methods-container">
      <header className="payment-methods-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiChevronLeft /> Volver
        </button>
        <h1>Métodos de Pago</h1>
      </header>

      {/* Carrusel de Tarjetas */}
      <div className="cards-carousel">
        {paymentMethods.length > 1 && (
          <button className="carousel-arrow left" onClick={prevCard}>
            <FiChevronLeftIcon />
          </button>
        )}
        
        <div className="cards-wrapper">
          {paymentMethods.map((method, index) => (
            <div 
              key={method.id} 
              className={`payment-card ${method.cardType} ${index === currentCardIndex ? 'active' : ''}`}
            >
              <div className="card-header">
                {renderCardIcon(method.cardType)}
                {method.isDefault && <span className="default-badge">Predeterminada</span>}
              </div>
              
              <div className="card-number">
                •••• •••• •••• {method.lastFour}
              </div>
              
              <div className="card-details">
                <div>
                  <div className="card-label">Titular</div>
                  <div className="card-value">{method.cardHolder}</div>
                </div>
                <div>
                  <div className="card-label">Expira</div>
                  <div className="card-value">{method.expiry}</div>
                </div>
              </div>
              
              <div className="card-actions">
                {!method.isDefault && (
                  <>
                    <button 
                      className="action-btn set-default"
                      onClick={() => setAsDefault(method.id)}
                    >
                      Usar como predeterminada
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => deleteCard(method.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {paymentMethods.length > 1 && (
          <button className="carousel-arrow right" onClick={nextCard}>
            <FiChevronRight />
          </button>
        )}
      </div>

      {/* Lista de métodos de pago */}
      <div className="payment-methods-list">
        <h2>Tus métodos de pago</h2>
        <ul>
          {paymentMethods.map(method => (
            <li key={method.id} className={method.isDefault ? 'default' : ''}>
              <div className="method-info">
                {renderCardIcon(method.cardType)}
                <span>Terminada en {method.lastFour}</span>
                {method.isDefault && <span className="default-tag">Predeterminada</span>}
              </div>
              <button 
                className="delete-btn"
                onClick={() => deleteCard(method.id)}
                disabled={method.isDefault && paymentMethods.length > 1}
              >
                <FiTrash2 />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showAddForm ? (
        <div className="add-payment-form">
          <h3>Agregar nueva tarjeta</h3>
          
          <div className="form-group">
            <label>Número de tarjeta</label>
            <input
              type="text"
              value={newPaymentMethod.cardNumber}
              onChange={(e) => setNewPaymentMethod({
                ...newPaymentMethod,
                cardNumber: e.target.value,
                cardType: detectCardType(e.target.value)
              })}
              placeholder="1234 5678 9012 3456"
              maxLength="16"
            />
          </div>
          
          <div className="form-group">
            <label>Nombre del titular</label>
            <input
              type="text"
              value={newPaymentMethod.cardHolder}
              onChange={(e) => setNewPaymentMethod({
                ...newPaymentMethod,
                cardHolder: e.target.value
              })}
              placeholder="Como aparece en la tarjeta"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Fecha de expiración</label>
              <input
                type="text"
                value={newPaymentMethod.expiry}
                onChange={(e) => setNewPaymentMethod({
                  ...newPaymentMethod,
                  expiry: e.target.value
                })}
                placeholder="MM/AA"
                maxLength="5"
              />
            </div>
            
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                value={newPaymentMethod.cvv}
                onChange={(e) => setNewPaymentMethod({
                  ...newPaymentMethod,
                  cvv: e.target.value
                })}
                placeholder="123"
                maxLength="4"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button className="cancel-btn" onClick={() => setShowAddForm(false)}>
              Cancelar
            </button>
            <button className="save-btn" onClick={handleAddPaymentMethod}>
              Guardar tarjeta
            </button>
          </div>
        </div>
      ) : (
        <button className="add-payment-btn" onClick={() => setShowAddForm(true)}>
          <FiPlus /> Agregar método de pago
        </button>
      )}
    </div>
  );
}

export default PaymentMethods;