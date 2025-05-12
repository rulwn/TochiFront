import React, { useState } from 'react';
import './AdminOrders.css';
import { FiSearch, FiPlus, FiFilter, FiChevronDown, FiBox, FiClock, FiUser, FiMapPin, FiDollarSign, FiCheck } from 'react-icons/fi';

function AdminOrdersImproved() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todas');
  const [selectedOrders, setSelectedOrders] = useState([]);
  
  // Datos de ejemplo para órdenes
  const orders = [
    {
      id: 'ORD-2023-0015',
      customer: 'Raúl Ochoa',
      date: '27/11/2024',
      status: 'Activo',
      address: 'Av. Roosevelt, Calle La Escalón 97',
      items: 3,
      total: 45.50,
      deliveryType: 'Express'
    },
    {
      id: 'ORD-2023-0014',
      customer: 'María Fernández',
      date: '26/11/2024',
      status: 'Completado',
      address: 'Colonia San Benito, Calle 5 #123',
      items: 5,
      total: 78.20,
      deliveryType: 'Estándar'
    },
    {
      id: 'ORD-2023-0013',
      customer: 'Carlos Martínez',
      date: '25/11/2024',
      status: 'Cancelado',
      address: 'Residencial Las Magnolias, Bloque C',
      items: 2,
      total: 32.75,
      deliveryType: 'Recoger'
    },
    {
      id: 'ORD-2023-0012',
      customer: 'Ana López',
      date: '24/11/2024',
      status: 'En proceso',
      address: 'Urbanización Las Palmas, Casa 12',
      items: 4,
      total: 60.00,
      deliveryType: 'Estándar'
    }
  ];

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(order => 
    selectedFilter === 'Todas' || order.status === selectedFilter
  );

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  return (
<<<<<<< HEAD
    <div className="orders-admin-container">
      {/* Barra superior con controles */}
      <div className="orders-admin-controls">
        <div className="orders-search-container">
          <FiSearch className="orders-search-icon" />
=======
    <div className="admin-orders-improved">
      {/* Barra superior con controles */}
      <div className="admin-orders-controls">
        <div className="admin-orders-search">
          <FiSearch className="admin-orders-search-icon" />
>>>>>>> c419aba4032c26061ea18233558bf125dfe370c5
          <input
            type="text"
            placeholder="Buscar órdenes por ID o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="orders-search-input"
          />
        </div>
        
<<<<<<< HEAD
        <div className="orders-controls-right">
          <div className="orders-filter-dropdown">
            <FiFilter className="orders-filter-icon" />
=======
        <div className="admin-orders-filters">
          <div className="admin-orders-filter">
            <FiFilter />
>>>>>>> c419aba4032c26061ea18233558bf125dfe370c5
            <select 
              value={selectedFilter} 
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="orders-filter-select"
            >
              <option>Todas</option>
              <option>Activo</option>
              <option>En proceso</option>
              <option>Completado</option>
              <option>Cancelado</option>
            </select>
<<<<<<< HEAD
            <FiChevronDown className="orders-dropdown-arrow" />
          </div>
          
          <button className="orders-add-button">
            <FiPlus className="orders-add-icon" /> Agregar
          </button>
=======
            <FiChevronDown className="admin-orders-dropdown-arrow" />
          </div>
          
          <div className="admin-orders-buttons">
            <button 
              className="admin-orders-select-btn"
              onClick={handleSelectAll}
            >
              {selectedOrders.length === filteredOrders.length ? 'Deseleccionar' : 'Seleccionar'}
            </button>
            <button className="admin-orders-add-btn">
              <FiPlus /> Agregar
            </button>
          </div>
>>>>>>> c419aba4032c26061ea18233558bf125dfe370c5
        </div>
      </div>

      {/* Listado de órdenes */}
<<<<<<< HEAD
      <div className="orders-list-grid">
        {filteredOrders.map(order => (
          <div key={order.id} className={`orders-card orders-status-${order.status.toLowerCase().replace(' ', '-')}`}>
            <div className="orders-card-header">
              <h3 className="orders-card-title">Orden #{order.id}</h3>
              <span className={`orders-status-badge orders-status-${order.status.toLowerCase().replace(' ', '-')}`}>
=======
      <div className="admin-orders-grid">
        {filteredOrders.map(order => (
          <div 
            key={order.id} 
            className={`admin-orders-card ${order.status.toLowerCase().replace(' ', '-')} ${
              selectedOrders.includes(order.id) ? 'selected' : ''
            }`}
            onClick={() => toggleOrderSelection(order.id)}
          >
            {selectedOrders.includes(order.id) && (
              <div className="admin-orders-checkmark">
                <FiCheck />
              </div>
            )}
            
            <div className="admin-orders-header">
              <h3>Orden #{order.id}</h3>
              <span className={`admin-orders-status ${order.status.toLowerCase().replace(' ', '-')}`}>
>>>>>>> c419aba4032c26061ea18233558bf125dfe370c5
                {order.status}
              </span>
            </div>
            
<<<<<<< HEAD
            <div className="orders-card-details">
              <div className="orders-detail-row">
                <FiUser className="orders-detail-icon" />
                <span className="orders-detail-text">{order.customer}</span>
              </div>
              
              <div className="orders-detail-row">
                <FiClock className="orders-detail-icon" />
                <span className="orders-detail-text">{order.date}</span>
              </div>
              
              <div className="orders-detail-row">
                <FiMapPin className="orders-detail-icon" />
                <span className="orders-detail-text">{order.address}</span>
              </div>
              
              <div className="orders-metrics-row">
                <div className="orders-metric">
                  <FiBox className="orders-metric-icon" />
                  <span className="orders-metric-text">{order.items} items</span>
                </div>
                
                <div className="orders-metric">
                  <FiDollarSign className="orders-metric-icon" />
                  <span className="orders-metric-text">${order.total.toFixed(2)}</span>
                </div>
                
                <div className="orders-metric">
                  <span className="orders-delivery-tag">{order.deliveryType}</span>
=======
            <div className="admin-orders-details">
              <div className="admin-orders-detail">
                <FiUser />
                <span>{order.customer}</span>
              </div>
              
              <div className="admin-orders-detail">
                <FiClock />
                <span>{order.date}</span>
              </div>
              
              <div className="admin-orders-detail">
                <FiMapPin />
                <span>{order.address}</span>
              </div>
              
              <div className="admin-orders-metrics">
                <div className="admin-orders-metric">
                  <FiBox />
                  <span>{order.items} items</span>
                </div>
                
                <div className="admin-orders-metric">
                  <FiDollarSign />
                  <span>${order.total.toFixed(2)}</span>
                </div>
                
                <div className="admin-orders-metric">
                  <span className="admin-orders-delivery">{order.deliveryType}</span>
>>>>>>> c419aba4032c26061ea18233558bf125dfe370c5
                </div>
              </div>
            </div>
            
<<<<<<< HEAD
            <div className="orders-card-actions">
              <button className="orders-action-btn orders-view-details">Ver detalles</button>
              <button className="orders-action-btn orders-quick-action">
=======
            <div className="admin-orders-actions">
              <button className="admin-orders-view-btn">Ver detalles</button>
              <button className="admin-orders-action-btn">
>>>>>>> c419aba4032c26061ea18233558bf125dfe370c5
                {order.status === 'Activo' ? 'Procesar' : 
                 order.status === 'En proceso' ? 'Completar' : 'Reabrir'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOrdersImproved;