import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Deliveryaddress.css'; // Asegúrate de tener este archivo CSS para estilos
import { FiChevronLeft, FiMapPin, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

function DeliveryAddress() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: 'Casa',
      address: 'Av. Las Magnolias #123, Colonia Escalón, San Salvador',
      isDefault: true,
      contactNumber: '+503 7890-1234'
    },
    {
      id: 2,
      title: 'Oficina',
      address: 'Calle Los Pinos #456, Edificio Corporativo, San Salvador',
      isDefault: false,
      contactNumber: '+503 7890-5678'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: '',
    address: '',
    contactNumber: ''
  });

  const handleAddAddress = () => {
    if (newAddress.title && newAddress.address) {
      setAddresses([
        ...addresses,
        {
          id: addresses.length + 1,
          ...newAddress,
          isDefault: false
        }
      ]);
      setNewAddress({ title: '', address: '', contactNumber: '' });
      setShowAddForm(false);
    }
  };

  const setAsDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const deleteAddress = (id) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  return (
    <div className="delivery-address-container">
      <header className="delivery-address-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiChevronLeft /> Volver
        </button>
        <h1>Dirección de Entrega</h1>
      </header>

      <div className="address-list">
        {addresses.map(address => (
          <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
            <div className="address-header">
              <FiMapPin className="address-icon" />
              <div className="address-title">
                <h3>{address.title}</h3>
                {address.isDefault && <span className="default-badge">Predeterminada</span>}
              </div>
              <div className="address-actions">
                <button className="icon-btn" onClick={() => setAsDefault(address.id)} disabled={address.isDefault}>
                  <FiEdit />
                </button>
                {!address.isDefault && (
                  <button className="icon-btn delete-btn" onClick={() => deleteAddress(address.id)}>
                    <FiTrash2 />
                  </button>
                )}
              </div>
            </div>
            
            <div className="address-details">
              <p>{address.address}</p>
              <p className="contact-number">Teléfono: {address.contactNumber}</p>
            </div>
            
            {address.isDefault && (
              <div className="address-footer">
                <span>Esta es tu dirección principal para entregas</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAddForm ? (
        <div className="add-address-form">
          <h3>Agregar nueva dirección</h3>
          <div className="form-group">
            <label>Nombre para la dirección (ej. Casa, Oficina)</label>
            <input 
              type="text" 
              value={newAddress.title}
              onChange={(e) => setNewAddress({...newAddress, title: e.target.value})}
              placeholder="Mi Casa"
            />
          </div>
          <div className="form-group">
            <label>Dirección completa</label>
            <textarea 
              value={newAddress.address}
              onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
              placeholder="Calle, número, colonia, ciudad"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Número de contacto</label>
            <input 
              type="text" 
              value={newAddress.contactNumber}
              onChange={(e) => setNewAddress({...newAddress, contactNumber: e.target.value})}
              placeholder="+503 7890-1234"
            />
          </div>
          <div className="form-actions">
            <button className="cancel-btn" onClick={() => setShowAddForm(false)}>
              Cancelar
            </button>
            <button className="save-btn" onClick={handleAddAddress}>
              Guardar dirección
            </button>
          </div>
        </div>
      ) : (
        <button className="add-address-btn" onClick={() => setShowAddForm(true)}>
          <FiPlus /> Agregar nueva dirección
        </button>
      )}
    </div>
  );
}

export default DeliveryAddress;