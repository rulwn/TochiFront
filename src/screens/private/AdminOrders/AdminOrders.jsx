import React, { useState } from 'react';
import { LuSearch, LuFilter, LuSquare, LuCheck, LuX, LuChevronDown, LuBox, LuClock, LuUser, LuMapPin, LuDollarSign } from 'react-icons/lu';
import './AdminOrders.css';

function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todas');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

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
    (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedFilter === 'Todas' || order.status === selectedFilter)
  );

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedOrders([]);
    }
  };

  const handleStatusChange = () => {
    // Aquí iría la lógica para actualizar el estado de las órdenes seleccionadas
    console.log("Cambiando estado a:", newStatus, "para órdenes:", selectedOrders);
    setShowStatusModal(false);
    setSelectionMode(false);
    setSelectedOrders([]);
  };

  return (
    <div className="admin-products-container">
      <div className="admin-toolbar1">
        <h1 className="admin-title1">Gestión de Órdenes</h1>

        <div className="search-container-products">
          <LuSearch className="search-icon-products" size={20} />
          <input
            type="text"
            placeholder="Buscar órdenes por ID o cliente..."
            className="search-input-products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-container">
          <LuFilter className="filter-icon" size={20} />
          <select
            className="category-filter"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option>Todas</option>
            <option>Activo</option>
            <option>En proceso</option>
            <option>Completado</option>
            <option>Cancelado</option>
          </select>
          <LuChevronDown className="orders-dropdown-arrow" />
        </div>

        <button
          className={`select-products-btn ${selectionMode ? 'active' : ''}`}
          onClick={toggleSelectionMode}
        >
          <LuSquare size={18} />
          <span>{selectionMode ? 'Cancelar' : 'Seleccionar'}</span>
        </button>
      </div>

      <div className="orders-list-grid">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className={`orders-card orders-status-${order.status.toLowerCase().replace(' ', '-')} ${selectionMode ? 'selection-mode' : ''} ${selectedOrders.includes(order.id) ? 'selected' : ''}`}
              onClick={() => selectionMode && toggleOrderSelection(order.id)}
            >
              {selectedOrders.includes(order.id) && (
                <div className="selection-checkmark">
                  <LuCheck size={16} />
                </div>
              )}
              
              <div className="orders-card-header">
                <h3 className="orders-card-title">Orden #{order.id}</h3>
                <span className={`orders-status-badge orders-status-${order.status.toLowerCase().replace(' ', '-')}`}>
                  {order.status}
                </span>
              </div>

              <div className="orders-card-details">
                <div className="orders-detail-row">
                  <LuUser className="orders-detail-icon" />
                  <span className="orders-detail-text">{order.customer}</span>
                </div>

                <div className="orders-detail-row">
                  <LuClock className="orders-detail-icon" />
                  <span className="orders-detail-text">{order.date}</span>
                </div>

                <div className="orders-detail-row">
                  <LuMapPin className="orders-detail-icon" />
                  <span className="orders-detail-text">{order.address}</span>
                </div>

                <div className="orders-metrics-row">
                  <div className="orders-metric">
                    <LuBox className="orders-metric-icon" />
                    <span className="orders-metric-text">{order.items} items</span>
                  </div>

                  <div className="orders-metric">
                    <LuDollarSign className="orders-metric-icon" />
                    <span className="orders-metric-text">${order.total.toFixed(2)}</span>
                  </div>

                  <div className="orders-metric">
                    <span className="orders-delivery-tag">{order.deliveryType}</span>
                  </div>
                </div>
              </div>

              <div className="orders-card-actions">
                <button className="orders-action-btn orders-view-details">Ver detalles</button>
                {!selectionMode && (
                  <button 
                    className="orders-action-btn orders-quick-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrders([order.id]);
                      setShowStatusModal(true);
                    }}
                  >
                    {order.status === 'Activo' ? 'Procesar' :
                      order.status === 'En proceso' ? 'Completar' : 'Reabrir'}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-products-message">
            No se encontraron órdenes que coincidan con los filtros.
          </div>
        )}
      </div>

      {selectionMode && selectedOrders.length > 0 && (
        <div className="selection-actions-bar">
          <div className="selected-count">
            {selectedOrders.length} seleccionados
          </div>
          <div className="selection-actions">
            <button
              className="selection-action-btn"
              onClick={() => setShowStatusModal(true)}
            >
              <LuCheck size={16} />
              <span>Cambiar estado</span>
            </button>
            <button
              className="selection-action-btn cancel"
              onClick={() => setSelectedOrders([])}
            >
              <LuX size={16} />
              <span>Deseleccionar</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal para cambiar estado */}
      {showStatusModal && (
        <div className="modal-overlay">
          <div className="status-modal-content">
            <h3 className="modal-title">Cambiar estado de órdenes</h3>
            
            <div className="form-group">
              <label>Nuevo estado:</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="status-select"
              >
                <option value="">Seleccionar estado</option>
                <option value="Activo">Activo</option>
                <option value="En proceso">En proceso</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
            
            <div className="modal-actions">
              <button
                className="modal-btn cancel-btn"
                onClick={() => {
                  setShowStatusModal(false);
                  setNewStatus('');
                }}
              >
                Cancelar
              </button>
              <button
                className="modal-btn confirm-btn"
                onClick={handleStatusChange}
                disabled={!newStatus}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;