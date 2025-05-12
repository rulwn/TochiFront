import React, { useState } from 'react';
import './AdminDashboard.css';
import { FiSearch, FiPlus, FiFilter, FiChevronDown, FiBox, FiClock, FiUser, FiMapPin, FiDollarSign, FiCheck } from 'react-icons/fi';

function AdminDashboardComplete() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todas');
  const [selectedOrders, setSelectedOrders] = useState([]);
  
  // Datos de ejemplo
  const stats = [
    { title: 'Ventas Totales', value: '$12,345', change: '+12%', trend: 'up' },
    { title: 'Órdenes', value: '189', change: '+5%', trend: 'up' },
    { title: 'Clientes', value: '342', change: '+8%', trend: 'up' },
    { title: 'Productos', value: '56', change: '-2%', trend: 'down' }
  ];

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
    }
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'Juan Pérez', date: '2023-11-28', amount: '$120.00', status: 'Completado' },
    { id: 'ORD-002', customer: 'María López', date: '2023-11-27', amount: '$85.50', status: 'Pendiente' },
    { id: 'ORD-003', customer: 'Carlos Gómez', date: '2023-11-26', amount: '$210.00', status: 'Enviado' },
    { id: 'ORD-004', customer: 'Ana Rodríguez', date: '2023-11-25', amount: '$65.75', status: 'Completado' }
  ];

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  };

  return (
    <div className="admin-dashboard-complete">
      {/* Sección de Estadísticas */}
      <h1 className="dashboard-title">Panel de Administración</h1>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3>{stat.title}</h3>
            <p>{stat.value}</p>
            <span className={`trend-${stat.trend}`}>{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Sección de Gráficos y Órdenes Recientes */}
      <div className="dashboard-main-content">
        <div className="charts-section">
          <div className="chart-container">
            <h3>Ventas Mensuales</h3>
            <div className="chart-placeholder">
              [Gráfico de Ventas Mensuales]
            </div>
          </div>
          
          <div className="chart-container">
            <h3>Productos Más Vendidos</h3>
            <div className="chart-placeholder">
              [Gráfico de Productos]
            </div>
          </div>
        </div>

        <div className="recent-orders-section">
          <div className="recent-orders">
            <h3>Órdenes Recientes</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.date}</td>
                    <td>{order.amount}</td>
                    <td className={`status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sección de Gestión de Órdenes */}
      <div className="orders-management">
        <h2 className="section-title">Gestión de Órdenes</h2>
        
        <div className="orders-controls">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar órdenes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filters-container">
            <div className="filter-dropdown">
              <FiFilter />
              <select 
                value={selectedFilter} 
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option>Todas</option>
                <option>Activo</option>
                <option>Completado</option>
                <option>Cancelado</option>
              </select>
              <FiChevronDown className="dropdown-arrow" />
            </div>
            
            <button className="add-button">
              <FiPlus /> Nueva Orden
            </button>
          </div>
        </div>

        <div className="orders-grid">
          {orders.map(order => (
            <div 
              key={order.id} 
              className={`order-card ${order.status.toLowerCase()} ${
                selectedOrders.includes(order.id) ? 'selected' : ''
              }`}
              onClick={() => toggleOrderSelection(order.id)}
            >
              {selectedOrders.includes(order.id) && (
                <div className="order-checkmark">
                  <FiCheck />
                </div>
              )}
              
              <div className="order-header">
                <h3>#{order.id}</h3>
                <span className={`status-badge ${order.status.toLowerCase()}`}>
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
                </div>
              </div>
              
              <div className="order-actions">
                <button className="view-btn">Ver</button>
                <button className="action-btn">
                  {order.status === 'Activo' ? 'Procesar' : 'Detalles'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardComplete;