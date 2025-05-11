import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Orders.css';
import { FiChevronLeft, FiClock, FiCheckCircle, FiPackage } from 'react-icons/fi';

function Orders() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  
  const sampleOrders = [
    {
      id: '#ORD-2023-0015',
      date: '15 Nov 2023',
      status: 'completed',
      items: [
        { name: 'Manzanas Orgánicas', quantity: 2, price: 3.50, image: 'https://i.imgur.com/6FpegJL.png' },
        { name: 'Lechuga Hidropónica', quantity: 1, price: 2.00, image: 'https://i.imgur.com/6FpegJL.png' }
      ],
      total: 9.00,
      delivery: 'Av. Las Magnolias #123, San Salvador'
    },
    {
      id: '#ORD-2023-0012',
      date: '10 Nov 2023',
      status: 'pending',
      items: [
        { name: 'Bananas Ecológicas', quantity: 3, price: 1.75, image: 'https://i.imgur.com/6FpegJL.png' },
        { name: 'Tomates Cherry', quantity: 2, price: 2.50, image: 'https://i.imgur.com/6FpegJL.png' }
      ],
      total: 10.25,
      delivery: 'Calle Los Pinos #456, San Salvador'
    },
    {
      id: '#ORD-2023-0008',
      date: '5 Nov 2023',
      status: 'completed',
      items: [
        { name: 'Zanahorias Orgánicas', quantity: 1, price: 1.80, image: 'https://i.imgur.com/6FpegJL.png' },
        { name: 'Espinacas Frescas', quantity: 2, price: 2.20, image: 'https://i.imgur.com/6FpegJL.png' }
      ],
      total: 6.20,
      delivery: 'Residencial Las Flores #789, San Salvador'
    }
  ];

  const filteredOrders = activeFilter === 'all' 
    ? sampleOrders 
    : sampleOrders.filter(order => order.status === activeFilter);

  return (
    <div className="orders-container">
      <header className="orders-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiChevronLeft /> Volver
        </button>
        <h1>Mis Órdenes</h1>
      </header>

      <div className="filters">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          Todas
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveFilter('pending')}
        >
          <FiClock /> Pendientes
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveFilter('completed')}
        >
          <FiCheckCircle /> Completadas
        </button>
      </div>

      <div className="orders-list">
        {filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date)).map(order => (
          <div key={order.id} className={`order-card ${order.status}`}>
            <div className="order-header">
              <div>
                <h3>{order.id}</h3>
                <p className="order-date">{order.date}</p>
              </div>
              <div className={`status-badge ${order.status}`}>
                {order.status === 'completed' ? (
                  <><FiCheckCircle /> Completada</>
                ) : (
                  <><FiClock /> Pendiente</>
                )}
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                  <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>{item.quantity} x ${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="delivery-info">
                <FiPackage />
                <span>{order.delivery}</span>
              </div>
              <div className="order-total">
                <span>Total:</span>
                <strong>${order.total.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;