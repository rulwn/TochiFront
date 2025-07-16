import React, { useState } from 'react';
import {
  LuSearch, LuFilter, LuSquare, LuCheck, LuX,
  LuChevronDown, LuBox, LuClock, LuUser,
  LuMapPin, LuDollarSign, LuEye
} from 'react-icons/lu';
import { useOrderData } from './hook/useOrderData';
import DetailOrderModal from './DetailOrder';
import './AdminOrders.css';

function AdminOrders() {
  const {
    orders,
    loading,
    error,
    getFilteredOrders,
    updateMultipleOrdersStatus,
    getNextStatusSuggestion
  } = useOrderData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todas');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  // Estados para el modal de detalles
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Filtrar órdenes usando el hook
  const filteredOrders = getFilteredOrders(searchTerm, selectedFilter);

  // Toggle selección de una orden
  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Cambiar modo selección y limpiar selección al salir
  const toggleSelectionMode = () => {
    setSelectionMode(prev => {
      if (prev) setSelectedOrders([]);
      return !prev;
    });
  };

  // Función para abrir modal de detalles
  const openDetailsModal = (order) => {
    setSelectedOrderDetails(order);
    setShowDetailsModal(true);
  };

  // Función para cerrar modal de detalles
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedOrderDetails(null);
  };

  // Cambiar estados seleccionados usando el hook
  const handleStatusChange = async () => {
    if (!newStatus) return;

    try {
      await updateMultipleOrdersStatus(selectedOrders, newStatus);
      setShowStatusModal(false);
      setSelectionMode(false);
      setSelectedOrders([]);
      setNewStatus('');
    } catch (error) {
      console.error('Error al actualizar estados:', error);
    }
  };

  const openStatusModalForSingleOrder = (orderId, currentStatus) => {
    setSelectedOrders([orderId]);
    const suggestedStatus = getNextStatusSuggestion(currentStatus);
    setNewStatus(suggestedStatus);
    setShowStatusModal(true);
  };

  // Componente para mostrar cada orden
  const OrderCard = ({ order }) => (
    <div
      key={order.id}
      className={`admin-orders-card admin-orders-status-${order.status.toLowerCase().replace(/ /g, '-')} ${selectionMode ? 'selection-mode' : ''} ${selectedOrders.includes(order.id) ? 'selected' : ''}`}
      onClick={() => selectionMode && toggleOrderSelection(order.id)}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (selectionMode && (e.key === 'Enter' || e.key === ' ')) toggleOrderSelection(order.id); }}
    >
      {selectedOrders.includes(order.id) && (
        <div className="admin-orders-selection-checkmark">
          <LuCheck size={16} />
        </div>
      )}

      <div className="admin-orders-card-header">
        <h3 className="admin-orders-card-title">Orden #{order.id.slice(-6)}</h3>
        <span className={`admin-orders-status-badge admin-orders-status-${order.status.toLowerCase().replace(/ /g, '-')}`}>
          {order.status}
        </span>
      </div>

      <div className="admin-orders-card-details">
        <div className="admin-orders-detail-row">
          <LuUser className="admin-orders-detail-icon" />
          <span className="admin-orders-detail-text">{order.customer}</span>
        </div>

        <div className="admin-orders-detail-row">
          <LuClock className="admin-orders-detail-icon" />
          <span className="admin-orders-detail-text">{order.date}</span>
        </div>

        <div className="admin-orders-detail-row">
          <LuMapPin className="admin-orders-detail-icon" />
          <span className="admin-orders-detail-text">{order.address}</span>
        </div>

        <div className="admin-orders-metrics-row">
          <div className="admin-orders-metric">
            <LuBox className="admin-orders-metric-icon" />
            <span className="admin-orders-metric-text">{order.items} items</span>
          </div>

          <div className="admin-orders-metric">
            <LuDollarSign className="admin-orders-metric-icon" />
            <span className="admin-orders-metric-text">${order.total.toFixed(2)}</span>
          </div>

          <div className="admin-orders-metric">
            <span className="admin-orders-delivery-tag">{order.deliveryType}</span>
          </div>
        </div>
      </div>

      <div className="admin-orders-card-actions">
        <button 
          className="admin-orders-action-btn admin-orders-view-details"
          onClick={(e) => {
            e.stopPropagation();
            openDetailsModal(order);
          }}
        >
          <LuEye size={16} />
          Ver detalles
        </button>
        {!selectionMode && (
          <button
            className="admin-orders-action-btn admin-orders-quick-action"
            onClick={(e) => {
              e.stopPropagation();
              openStatusModalForSingleOrder(order.id, order.status);
            }}
          >
            {order.status === 'Pendiente' ? 'Procesar' :
              order.status === 'En proceso' ? 'Completar' : 'Reabrir'}
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-orders-container">
        <div className="loading-message">Cargando órdenes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-orders-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="admin-orders-container">
      <header className="admin-orders-toolbar">
        <h1 className="admin-orders-title">Gestión de Órdenes</h1>

        <div className="admin-orders-search-container">
          <LuSearch className="admin-orders-search-icon" size={20} />
          <input
            type="text"
            placeholder="Buscar órdenes por ID o cliente..."
            className="admin-orders-search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-orders-filter-container">
          <LuFilter className="admin-orders-filter-icon" size={20} />
          <select
            className="admin-orders-category-filter"
            value={selectedFilter}
            onChange={e => setSelectedFilter(e.target.value)}
          >
            <option>Todas</option>
            <option>Pendiente</option>
            <option>En proceso</option>
            <option>Entregado</option>
            <option>Cancelado</option>
          </select>
          <LuChevronDown className="admin-orders-dropdown-arrow" />
        </div>

        <button
          className={`admin-orders-select-btn ${selectionMode ? 'active' : ''}`}
          onClick={toggleSelectionMode}
        >
          <LuSquare size={18} />
          <span>{selectionMode ? 'Cancelar' : 'Seleccionar'}</span>
        </button>
      </header>

      <main className="admin-orders-list-grid">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => <OrderCard key={order.id} order={order} />)
        ) : (
          <div className="admin-orders-no-message">
            No se encontraron órdenes que coincidan con los filtros.
          </div>
        )}
      </main>

      {selectionMode && selectedOrders.length > 0 && (
        <section className="admin-orders-selection-actions-bar">
          <div className="admin-orders-selected-count">{selectedOrders.length} seleccionados</div>
          <div className="admin-orders-selection-actions">
            <button
              className="admin-orders-selection-action-btn"
              onClick={() => setShowStatusModal(true)}
            >
              <LuCheck size={16} />
              <span>Cambiar estado</span>
            </button>
            <button
              className="admin-orders-selection-action-btn cancel"
              onClick={() => setSelectedOrders([])}
            >
              <LuX size={16} />
              <span>Deseleccionar</span>
            </button>
          </div>
        </section>
      )}

      {/* Modal de cambio de estado */}
      {showStatusModal && (
        <div className="admin-orders-modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="admin-orders-status-modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="admin-orders-modal-title">Cambiar estado de órdenes</h3>

            <div className="admin-orders-form-group">
              <label>Nuevo estado:</label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                className="admin-orders-status-select"
              >
                <option value="">Seleccionar estado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En proceso">En proceso</option>
                <option value="Entregado">Entregado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div className="admin-orders-modal-actions">
              <button
                className="admin-orders-modal-btn admin-orders-cancel-btn"
                onClick={() => {
                  setShowStatusModal(false);
                  setNewStatus('');
                }}
              >
                Cancelar
              </button>
              <button
                className="admin-orders-modal-btn admin-orders-confirm-btn"
                onClick={handleStatusChange}
                disabled={!newStatus}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles usando el componente externo */}
      {showDetailsModal && (
        <DetailOrderModal
          orderDetails={selectedOrderDetails}
          isOpen={showDetailsModal}
          onClose={closeDetailsModal}
          onChangeStatusClick={(orderId, currentStatus) => {
            closeDetailsModal();
            openStatusModalForSingleOrder(orderId, currentStatus);
          }}
        />
      )}
    </div>
  );
}

export default AdminOrders;