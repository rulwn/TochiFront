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
    <div className="modal-overlay" onClick={onClose}>
      <div className="details-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <LuPackage className="modal-title-icon" />
            Detalles de Orden #{orderDetails.id.slice(-6)}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <LuX size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Información del Cliente */}
          <section className="details-section">
            <h3 className="section-title">
              <LuUser className="section-icon" />
              Información del Cliente
            </h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Nombre:</span>
                <span className="detail-value">{orderDetails.customer}</span>
              </div>
              {orderDetails.customerEmail && (
                <div className="detail-item">
                  <span className="detail-label">
                    <LuMail className="detail-icon" />
                    Email:
                  </span>
                  <span className="detail-value">{orderDetails.customerEmail}</span>
                </div>
              )}
              {orderDetails.customerPhone && (
                <div className="detail-item">
                  <span className="detail-label">
                    <LuPhone className="detail-icon" />
                    Teléfono:
                  </span>
                  <span className="detail-value">{orderDetails.customerPhone}</span>
                </div>
              )}
            </div>
          </section>

          {/* Información de la Orden */}
          <section className="details-section">
            <h3 className="section-title">
              <LuCalendar className="section-icon" />
              Información de la Orden
            </h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Fecha:</span>
                <span className="detail-value">{orderDetails.date}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Estado:</span>
                <span className={`detail-value status-badge status-${orderDetails.status.toLowerCase().replace(/ /g, '-')}`}>
                  {orderDetails.status}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <LuMapPin className="detail-icon" />
                  Dirección:
                </span>
                <span className="detail-value">{orderDetails.address}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <LuCreditCard className="detail-icon" />
                  Método de pago:
                </span>
                <span className="detail-value">{orderDetails.deliveryType}</span>
              </div>
            </div>
          </section>

          {/* Productos */}
          <section className="details-section">
            <h3 className="section-title">
              <LuBox className="section-icon" />
              Productos ({orderDetails.products.length})
            </h3>
            <div className="products-list">
              {orderDetails.products.map((product, index) => (
                <div key={index} className="product-item">
                  <div className="product-info">
                    <span className="product-name">{product.idProduct?.name || 'Producto sin nombre'}</span>
                    <span className="product-quantity">Cantidad: {product.quantity || 0}</span>
                  </div>
                  <div className="product-pricing">
                    <span className="product-price">
                      ${(product.subtotal || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Resumen de Totales */}
          <section className="details-section">
            <h3 className="section-title">
              <LuDollarSign className="section-icon" />
              Resumen
            </h3>
            <div className="totals-summary">
              <div className="total-item">
                <span className="total-label">Total de items:</span>
                <span className="total-value">{orderDetails.items}</span>
              </div>
              <div className="total-item total-final">
                <span className="total-label">Total a pagar:</span>
                <span className="total-value">${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Notas (si existen) */}
          {orderDetails.notes && (
            <section className="details-section">
              <h3 className="section-title">Notas adicionales</h3>
              <div className="notes-content">
                {orderDetails.notes}
              </div>
            </section>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-btn secondary-btn" onClick={onClose}>
            Cerrar
          </button>
          <button 
            className="modal-btn primary-btn"
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