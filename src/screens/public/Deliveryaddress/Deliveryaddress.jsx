import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDeliveryAddresses from './hook/useDeliveryAddresses'; 

import './Deliveryaddress.css';
import { FiChevronLeft, FiMapPin, FiPlus, FiEdit, FiTrash2, FiCheck } from 'react-icons/fi';

function DeliveryAddress() {
  const navigate = useNavigate();
  const {
    addresses,
    loading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  } = useDeliveryAddresses();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    title: '',
    address: '',
    contactNumber: ''
  });

  const handleAddAddress = async () => {
    if (newAddress.title && newAddress.address) {
      const result = await addAddress(newAddress);
      if (result.success) {
        setNewAddress({ title: '', address: '', contactNumber: '' });
        setShowAddForm(false);
      } else {
        alert(result.message || 'Error al agregar dirección');
      }
    } else {
      alert('Por favor completa el título y la dirección');
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setNewAddress({
      title: address.title,
      address: address.address,
      contactNumber: address.contactNumber || ''
    });
    setShowAddForm(true);
  };

  const handleUpdateAddress = async () => {
    if (editingAddress && newAddress.title && newAddress.address) {
      const result = await updateAddress(editingAddress._id, newAddress);
      if (result.success) {
        setNewAddress({ title: '', address: '', contactNumber: '' });
        setShowAddForm(false);
        setEditingAddress(null);
      } else {
        alert(result.message || 'Error al actualizar dirección');
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    const result = await setDefaultAddress(addressId);
    if (!result.success) {
      alert(result.message || 'Error al establecer dirección por defecto');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      const result = await deleteAddress(addressId);
      if (!result.success) {
        alert(result.message || 'Error al eliminar dirección');
      }
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    setNewAddress({ title: '', address: '', contactNumber: '' });
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="delivery-address-container">
        <header className="delivery-address-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <FiChevronLeft /> Volver
          </button>
          <h1>Dirección de Entrega</h1>
        </header>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Cargando direcciones...
        </div>
      </div>
    );
  }

  return (
    <div className="delivery-address-container">
      <header className="delivery-address-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiChevronLeft /> Volver
        </button>
        <h1>Dirección de Entrega</h1>
      </header>

      {error && (
        <div className="error-message" style={{ 
          background: '#ffebee', 
          color: '#c62828', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <div className="address-list">
        {addresses.map(address => (
          <div key={address._id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
            <div className="address-header">
              <FiMapPin className="address-icon" />
              <div className="address-title">
                <h3>{address.title}</h3>
                {address.isDefault && <span className="default-badge">Predeterminada</span>}
              </div>
              <div className="address-actions">
                <button 
                  className="icon-btn" 
                  onClick={() => handleEditAddress(address)}
                  title="Editar dirección"
                >
                  <FiEdit />
                </button>
                {!address.isDefault && (
                  <button 
                    className="icon-btn" 
                    onClick={() => handleSetDefault(address._id)}
                    title="Establecer como predeterminada"
                  >
                    <FiCheck />
                  </button>
                )}
                {addresses.length > 1 && (
                  <button 
                    className="icon-btn delete-btn" 
                    onClick={() => handleDeleteAddress(address._id)}
                    title="Eliminar dirección"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            </div>
            
            <div className="address-details">
              <p>{address.address}</p>
              {address.contactNumber && (
                <p className="contact-number">Teléfono: {address.contactNumber}</p>
              )}
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
          <h3>{editingAddress ? 'Editar dirección' : 'Agregar nueva dirección'}</h3>
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
            <label>Número de contacto (opcional)</label>
            <input 
              type="text" 
              value={newAddress.contactNumber}
              onChange={(e) => setNewAddress({...newAddress, contactNumber: e.target.value})}
              placeholder="+503 7890-1234"
            />
          </div>
          <div className="form-actions">
            <button 
              className="cancel-btn" 
              onClick={cancelForm}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              className="save-btn" 
              onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
              disabled={loading}
            >
              {loading ? 'Guardando...' : (editingAddress ? 'Actualizar dirección' : 'Guardar dirección')}
            </button>
          </div>
        </div>
      ) : (
        <button 
          className="add-address-btn" 
          onClick={() => setShowAddForm(true)}
          disabled={loading}
        >
          <FiPlus /> Agregar nueva dirección
        </button>
      )}

      {loading && addresses.length > 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '1rem', 
          color: '#666',
          fontSize: '0.9rem'
        }}>
          Procesando...
        </div>
      )}
    </div>
  );
}

export default DeliveryAddress;