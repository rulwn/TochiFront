import {
  LuX, LuPackage, LuUser, LuMail, LuPhone, LuCalendar,
  LuMapPin, LuCreditCard, LuBox, LuDollarSign, LuTruck,
  LuCheck, LuOctagonX , LuInfo
} from 'react-icons/lu';
import './DetailOrder.css';

function DetailOrderModal({ 
  isOpen, 
  onClose, 
  orderDetails, 
  onChangeStatusClick 
}) {
  if (!isOpen || !orderDetails) return null;

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-SV', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para traducir estados
  const translateStatus = (status) => {
    const statusMap = {
      'pending': 'Pendiente',
      'processing': 'Procesando',
      'completed': 'Completado',
      'failed': 'Fallido',
      'refunded': 'Reembolsado',
      'preparing': 'Preparando',
      'shipped': 'Enviado',
      'in_transit': 'En tránsito',
      'delivered': 'Entregado',
      'standard': 'Estándar',
      'express': 'Express',
      'pickup': 'Recoger en tienda'
    };
    return statusMap[status] || status;
  };

  // Métodos de pago traducidos
  const paymentMethods = {
    'credit-card': 'Tarjeta de crédito',
    'paypal': 'PayPal',
    'wompi': 'Wompi',
    'payphone': 'PayPhone',
    'bank-transfer': 'Transferencia bancaria',
    'cash': 'Efectivo'
  };

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
                <span className="detail-order-detail-label">Fecha creación:</span>
                <span className="detail-order-detail-value">{orderDetails.date}</span>
              </div>
              
              <div className="detail-order-detail-item">
                <span className="detail-order-detail-label">Estado orden:</span>
                <span className={`detail-order-detail-value detail-order-status-badge detail-order-status-${orderDetails.status.toLowerCase().replace(/ /g, '-')}`}>
                  {orderDetails.status}
                </span>
              </div>
              
              <div className="detail-order-detail-item">
                <span className="detail-order-detail-label">Estado de pago:</span>
                <span className={`detail-order-detail-value detail-order-status-badge detail-order-status-${orderDetails.paymentStatus.toLowerCase().replace(/_/g, '-')}`}>
                  <span className="detail-order-status-icon">
                    {orderDetails.paymentStatus === 'completed' ? <LuCheck size={14} /> : 
 orderDetails.paymentStatus === 'failed' ? <LuOctagonX  size={14} /> : 
 <LuInfo size={14} />}
                  </span>
                  {translateStatus(orderDetails.paymentStatus)}
                </span>
              </div>
              
              <div className="detail-order-detail-item">
                <span className="detail-order-detail-label">Estado de envío:</span>
                <span className={`detail-order-detail-value detail-order-status-badge detail-order-status-${orderDetails.deliveryStatus.toLowerCase().replace(/_/g, '-')}`}>
                  <span className="detail-order-status-icon">
                    {orderDetails.paymentStatus === 'completed' ? <LuCheck size={14} /> : 
 orderDetails.paymentStatus === 'failed' ? <LuOctagonX  size={14} /> : 
 <LuInfo size={14} />}
                  </span>
                  {translateStatus(orderDetails.deliveryStatus)}
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
                <span className="detail-order-detail-value">
                  {paymentMethods[orderDetails.deliveryType] || orderDetails.deliveryType}
                </span>
              </div>
              
              <div className="detail-order-detail-item">
                <span className="detail-order-detail-label">
                  <LuTruck className="detail-order-detail-icon" />
                  Método de envío:
                </span>
                <span className="detail-order-detail-value">
                  {translateStatus(orderDetails.deliveryMethod)}
                </span>
              </div>
              
              {orderDetails.paymentId && (
                <div className="detail-order-detail-item">
                  <span className="detail-order-detail-label">ID de transacción:</span>
                  <span className="detail-order-detail-value detail-order-copyable" title="Copiar al portapapeles">
                    {orderDetails.paymentId}
                  </span>
                </div>
              )}
              
              {orderDetails.trackingNumber && (
                <div className="detail-order-detail-item">
                  <span className="detail-order-detail-label">N° de seguimiento:</span>
                  <span className="detail-order-detail-value detail-order-copyable" title="Copiar al portapapeles">
                    {orderDetails.trackingNumber}
                  </span>
                </div>
              )}
              
              {orderDetails.deliveryDate && (
                <div className="detail-order-detail-item">
                  <span className="detail-order-detail-label">Fecha estimada de entrega:</span>
                  <span className="detail-order-detail-value">
                    {formatDate(orderDetails.deliveryDate)}
                  </span>
                </div>
              )}
              
              {orderDetails.paymentConfirmedAt && (
                <div className="detail-order-detail-item">
                  <span className="detail-order-detail-label">Pago confirmado el:</span>
                  <span className="detail-order-detail-value">
                    {formatDate(orderDetails.paymentConfirmedAt)}
                  </span>
                </div>
              )}
              
              {orderDetails.cancelledAt && (
                <div className="detail-order-detail-item">
                  <span className="detail-order-detail-label">Cancelada el:</span>
                  <span className="detail-order-detail-value">
                    {formatDate(orderDetails.cancelledAt)}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Resumen de Pagos */}
          <section className="detail-order-details-section">
            <h3 className="detail-order-section-title">
              <LuDollarSign className="detail-order-section-icon" />
              Resumen de Pagos
            </h3>
            <div className="detail-order-totals-summary">
              <div className="detail-order-total-item">
                <span className="detail-order-total-label">Subtotal productos:</span>
                <span className="detail-order-total-value">
                  ${(orderDetails.total - orderDetails.deliveryCost + orderDetails.discount).toFixed(2)}
                </span>
              </div>
              
              {orderDetails.discount > 0 && (
                <div className="detail-order-total-item detail-order-discount">
                  <span className="detail-order-total-label">Descuento:</span>
                  <span className="detail-order-total-value">
                    -${orderDetails.discount.toFixed(2)}
                  </span>
                </div>
              )}
              
              <div className="detail-order-total-item">
                <span className="detail-order-total-label">Costo de envío:</span>
                <span className="detail-order-total-value">
                  ${orderDetails.deliveryCost.toFixed(2)}
                </span>
              </div>
              
              <div className="detail-order-total-item detail-order-total-final">
                <span className="detail-order-total-label">Total pagado:</span>
                <span className="detail-order-total-value">
                  ${orderDetails.total.toFixed(2)}
                </span>
              </div>
              
              {orderDetails.promoCode && (
                <div className="detail-order-total-item detail-order-promo">
                  <span className="detail-order-total-label">Código promocional:</span>
                  <span className="detail-order-total-value">
                    {orderDetails.promoCode}
                  </span>
                </div>
              )}
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
                  <div className="detail-order-product-image">
                    {product.idProduct?.imageUrl ? (
                      <img src={product.idProduct.imageUrl} alt={product.idProduct.name} />
                    ) : (
                      <div className="detail-order-product-image-placeholder">
                        <LuBox size={24} />
                      </div>
                    )}
                  </div>
                  <div className="detail-order-product-info">
                    <span className="detail-order-product-name">
                      {product.idProduct?.name || 'Producto sin nombre'}
                    </span>
                    <span className="detail-order-product-sku">
                      {product.idProduct?.sku || 'SKU no disponible'}
                    </span>
                    <span className="detail-order-product-quantity">
                      Cantidad: {product.quantity || 0}
                    </span>
                  </div>
                  <div className="detail-order-product-pricing">
                    <span className="detail-order-product-price">
                      ${(product.subtotal || 0).toFixed(2)}
                    </span>
                    {product.quantity > 1 && (
                      <span className="detail-order-product-unit-price">
                        (${(product.subtotal / product.quantity).toFixed(2)} c/u)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Notas y razón de cancelación */}
          {(orderDetails.notes || orderDetails.cancelReason) && (
            <section className="detail-order-details-section">
              <h3 className="detail-order-section-title">Información adicional</h3>
              <div className="detail-order-notes-content">
                {orderDetails.notes && (
                  <div className="detail-order-note">
                    <h4 className="detail-order-note-title">
                      <LuInfo className="detail-order-note-icon" />
                      Notas:
                    </h4>
                    <p>{orderDetails.notes}</p>
                  </div>
                )}
                {orderDetails.cancelReason && (
                  <div className="detail-order-note detail-order-cancel-note">
                    <h4 className="detail-order-note-title">
                      <LuAlertCircle className="detail-order-note-icon" />
                      Razón de cancelación:
                    </h4>
                    <p>{orderDetails.cancelReason}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Detalles de transacción (si existen) */}
          {orderDetails.transactionDetails && (
            <section className="detail-order-details-section">
              <h3 className="detail-order-section-title">Detalles de transacción</h3>
              <div className="detail-order-transaction-details">
                <pre className="detail-order-transaction-json">
                  {JSON.stringify(orderDetails.transactionDetails, null, 2)}
                </pre>
              </div>
            </section>
          )}
        </div>

        <div className="detail-order-modal-footer">
          <button 
            className="detail-order-secondary-btn" 
            onClick={onClose}
          >
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