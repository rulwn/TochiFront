import {
  LuX, LuPackage, LuUser, LuMail, LuPhone, LuCalendar,
  LuMapPin, LuCreditCard, LuBox, LuDollarSign
} from 'react-icons/lu';
import './DetailOrder.css';

function DetailOrderModal({ 
  isOpen, 
  onClose, 
  orderDetails, 
  onChangeStatusClick 
}) {
  if (!isOpen || !orderDetails) return null;

  return (
    <div className="detail-order-modal-overlay" onClick={onClose}>
      <div className="detail-order-modal-content" onClick={e => e.stopPropagation()}>
        <div className="detail-order-modal-header">
          <h2 className="detail-order-modal-title">
            <LuPackage className="detail-order-modal-title-icon" />
            Detalles de Orden #{orderDetails.id.slice(-6)}
          </h2>
          <button className="detail-order-modal-close-btn" onClick={onClose}>
            <LuX size={24} />
          </button>
        </div>

        <div className="detail-order-modal-body">
          {/* Información del Cliente */}
          <section className="detail-order-details-section">
            <h3 className="detail-order-section-title">
              <LuUser className="detail-order-section-icon" />
              Información del Cliente
            </h3>
            <div className="detail-order-details-grid">
              <div className="detail-order-detail-item">
                <span className="detail-order-detail-label">Nombre:</span>
                <span className="detail-order-detail-value">{orderDetails.customer}</span>
              </div>
              {orderDetails.customerEmail && (
                <div className="detail-order-detail-item">
                  <span className="detail-order-detail-label">
                    <LuMail className="detail-order-detail-icon" />
                    Email:
                  </span>
                  <span className="detail-order-detail-value">{orderDetails.customerEmail}</span>
                </div>
              )}
              {orderDetails.customerPhone && (
                <div className="detail-order-detail-item">
                  <span className="detail-order-detail-label">
                    <LuPhone className="detail-order-detail-icon" />
                    Teléfono:
                  </span>
                  <span className="detail-order-detail-value">{orderDetails.customerPhone}</span>
                </div>
              )}
            </div>
          </section>

          {/* Información de la Orden */}
          <section className="detail-order-details-section">
            <h3 className="detail-order-section-title">
              <LuCalendar className="detail-order-section-icon" />
              Información de la Orden
            </h3>
            <div className="detail-order-details-grid">
              <div className="detail-order-detail-item">
                <span className="detail-order-detail-label">Fecha:</span>
                <span className="detail-order-detail-value">{orderDetails.date}</span>
              </div>
              <div className="detail-order-detail-item">
                <span className="detail-order-detail-label">Estado:</span>
                <span className={`detail-order-detail-value detail-order-status-badge detail-order-status-${orderDetails.status.toLowerCase().replace(/ /g, '-')}`}>
                  {orderDetails.status}
                </span>
              </div>
              <div className="detail-order-detail-item">
                <span className="detail-order-detail-label">
                  <LuMapPin className="detail-order-detail-icon" />
                  Dirección:
                </span>
                <span className="detail-order-detail-value">{orderDetails.address}</span>
              </div>
              <div className="detail-order-detail-item">
                <span className="detail-order-detail-label">
                  <LuCreditCard className="detail-order-detail-icon" />
                  Método de pago:
                </span>
                <span className="detail-order-detail-value">{orderDetails.deliveryType}</span>
              </div>
            </div>
          </section>

          {/* Productos */}
          <section className="detail-order-details-section">
            <h3 className="detail-order-section-title">
              <LuBox className="detail-order-section-icon" />
              Productos ({orderDetails.products.length})
            </h3>
            <div className="detail-order-products-list">
              {orderDetails.products.map((product, index) => (
                <div key={index} className="detail-order-product-item">
                  <div className="detail-order-product-info">
                    <span className="detail-order-product-name">{product.idProduct?.name || 'Producto sin nombre'}</span>
                    <span className="detail-order-product-quantity">Cantidad: {product.quantity || 0}</span>
                  </div>
                  <div className="detail-order-product-pricing">
                    <span className="detail-order-product-price">
                      ${(product.subtotal || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Resumen de Totales */}
          <section className="detail-order-details-section">
            <h3 className="detail-order-section-title">
              <LuDollarSign className="detail-order-section-icon" />
              Resumen
            </h3>
            <div className="detail-order-totals-summary">
              <div className="detail-order-total-item">
                <span className="detail-order-total-label">Total de items:</span>
                <span className="detail-order-total-value">{orderDetails.items}</span>
              </div>
              <div className="detail-order-total-item detail-order-total-final">
                <span className="detail-order-total-label">Total a pagar:</span>
                <span className="detail-order-total-value">${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Notas (si existen) */}
          {orderDetails.notes && (
            <section className="detail-order-details-section">
              <h3 className="detail-order-section-title">Notas adicionales</h3>
              <div className="detail-order-notes-content">
                {orderDetails.notes}
              </div>
            </section>
          )}
        </div>

        <div className="detail-order-modal-footer">
          <button className="detail-order-secondary-btn" onClick={onClose}>
            Cerrar
          </button>
          <button 
            className="detail-order-primary-btn"
            onClick={() => {
              onClose();
              onChangeStatusClick(orderDetails.id, orderDetails.status);
            }}
          >
            Cambiar Estado
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailOrderModal;