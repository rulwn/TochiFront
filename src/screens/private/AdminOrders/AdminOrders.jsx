import React, { useState } from 'react';
import './AdminOrders.css';
import { FiSearch, FiPlus, FiFilter, FiChevronDown, FiBox, FiClock, FiUser, FiMapPin, FiDollarSign } from 'react-icons/fi';

function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todas');
  
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

  return (
    <div className="admin-orders-container">
      {/* Barra superior con controles */}
      <div className="admin-controls">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar órdenes por ID o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="controls-right">
          <div className="filter-dropdown">
            <FiFilter />
            <select 
              value={selectedFilter} 
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option>Todas</option>
              <option>Activo</option>
              <option>En proceso</option>
              <option>Completado</option>
              <option>Cancelado</option>
            </select>
            <FiChevronDown className="dropdown-arrow" />
          </div>
          
          <button className="add-button">
            <FiPlus /> Agregar
          </button>
        </div>
      </div>

      {/* Listado de órdenes */}
      <div className="orders-grid">
        {filteredOrders.map(order => (
          <div key={order.id} className={`order-card ${order.status.toLowerCase().replace(' ', '-')}`}>
            <div className="order-header">
              <h3>Orden #{order.id}</h3>
              <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                {order.status}
              </span>
            </div>
            
            <div className="order-details">
              <div className="detail-row">
                <FiUser />
                <span>{order.customer}</span>
              </div>
              
              <div className="detail-row">
                <FiClock />
                <span>{order.date}</span>
              </div>
              
              <div className="detail-row">
                <FiMapPin />
                <span>{order.address}</span>
              </div>
              
              <div className="metrics-row">
                <div className="metric">
                  <FiBox />
                  <span>{order.items} items</span>
                </div>
                
                <div className="metric">
                  <FiDollarSign />
                  <span>${order.total.toFixed(2)}</span>
                </div>
                
                <div className="metric">
                  <span className="delivery-tag">{order.deliveryType}</span>
                </div>
              </div>
            </div>
            
            <div className="order-actions">
              <button className="action-btn view-details">Ver detalles</button>
              <button className="action-btn quick-action">
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

export default AdminOrders;