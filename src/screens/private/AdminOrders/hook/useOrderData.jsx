import { useState, useCallback, useEffect } from 'react';

export const useOrderData = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener headers de autenticación
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch orders usando la nueva estructura
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const headers = getAuthHeaders();
      const res = await fetch('https://api-rest-bl9i.onrender.com/api/order', {
        headers
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const response = await res.json();
      const ordersData = response.success ? response.data : response;

      const mapped = ordersData.map(order => {
        const cart = order.cartId;
        let customerName = 'Cliente desconocido';
        let customerEmail = '';
        let customerPhone = '';

        // Obtener información del cliente desde el carrito poblado
        if (cart && cart.idClient) {
          if (typeof cart.idClient === 'object') {
            // Si idClient está poblado
            customerName = cart.idClient.name?.trim() || customerName;
            customerEmail = cart.idClient.email || '';
            customerPhone = cart.idClient.phone || '';
          }
        }

        // Calcular total y cantidad de items desde el carrito
        const total = order.finalTotal || cart?.total || 0;
        const items = cart?.Products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0;

        // Formatear dirección
        const address = order.address ? 
          `${order.address.street}, ${order.address.city}${order.address.state ? ', ' + order.address.state : ''}` : 
          'Sin dirección';

        // Fecha en formato local
        const date = new Date(order.createdAt).toLocaleDateString('es-SV');

        return {
          id: order._id,
          customer: customerName,
          customerEmail,
          customerPhone,
          date,
          status: order.state || 'Pendiente',
          address,
          items,
          total,
          deliveryType: order.payingMetod || 'Efectivo',
          products: cart?.Products || [],
          notes: order.notes || '',
          createdAt: order.createdAt,
          // Campos adicionales para el detalle
          paymentStatus: order.paymentStatus || 'pending',
          deliveryStatus: order.deliveryStatus || 'pending',
          deliveryMethod: order.deliveryMethod || 'standard',
          deliveryCost: order.deliveryCost || 0,
          discount: order.discount || 0,
          promoCode: order.promoCode || '',
          trackingNumber: order.trackingNumber || '',
          paymentId: order.paymentId || ''
        };
      });

      setOrders(mapped);
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para actualizar el estado de una orden
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`https://api-rest-bl9i.onrender.com/api/order/${orderId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ state: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el estado de la orden');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error al actualizar el estado de la orden');
      }

      return true;
    } catch (error) {
      console.error(`Error actualizando estado de la orden ${orderId}:`, error);
      throw error;
    }
  };

  // Función para actualizar múltiples órdenes
  const updateMultipleOrdersStatus = async (orderIds, newStatus) => {
    const results = [];
    
    for (const orderId of orderIds) {
      try {
        await updateOrderStatus(orderId, newStatus);
        results.push({ orderId, success: true });
      } catch (error) {
        results.push({ orderId, success: false, error: error.message });
      }
    }

    // Refrescar datos después de actualizar
    await fetchOrders();
    
    return results;
  };

  // Función para filtrar órdenes
  const getFilteredOrders = (searchTerm, statusFilter) => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'Todas' || 
        order.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  };

  // Función para obtener una orden específica por ID
  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  // Función para obtener sugerencia de próximo estado basado en los nuevos estados
  const getNextStatusSuggestion = (currentStatus) => {
    switch (currentStatus) {
      case 'Pendiente':
        return 'Confirmado';
      case 'Confirmado':
        return 'Procesando';
      case 'Procesando':
        return 'Enviado';
      case 'Enviado':
        return 'Entregado';
      case 'Entregado':
      case 'Cancelado':
      case 'Pago Fallido':
        return 'Pendiente';
      default:
        return 'Confirmado';
    }
  };

  // Función para cancelar una orden
  const cancelOrder = async (orderId, reason = '') => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`https://api-rest-bl9i.onrender.com/api/order/${orderId}/cancel`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cancelar la orden');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error al cancelar la orden');
      }

      // Refrescar datos después de cancelar
      await fetchOrders();
      
      return true;
    } catch (error) {
      console.error(`Error cancelando orden ${orderId}:`, error);
      throw error;
    }
  };

  // Función para confirmar pago
  const confirmPayment = async (orderId, paymentData) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`https://api-rest-bl9i.onrender.com/api/order/${orderId}/payment`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al confirmar el pago');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error al confirmar el pago');
      }

      // Refrescar datos después de confirmar pago
      await fetchOrders();
      
      return true;
    } catch (error) {
      console.error(`Error confirmando pago de orden ${orderId}:`, error);
      throw error;
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    // Estados
    orders,
    loading,
    error,
    
    // Funciones principales
    fetchOrders,
    updateOrderStatus,
    updateMultipleOrdersStatus,
    cancelOrder,
    confirmPayment,
    
    // Funciones de utilidad
    getFilteredOrders,
    getOrderById,
    getNextStatusSuggestion,
    
    // Estadísticas actualizadas con los nuevos estados
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'Pendiente').length,
    confirmedOrders: orders.filter(o => o.status === 'Confirmado').length,
    processingOrders: orders.filter(o => o.status === 'Procesando').length,
    shippedOrders: orders.filter(o => o.status === 'Enviado').length,
    deliveredOrders: orders.filter(o => o.status === 'Entregado').length,
    cancelledOrders: orders.filter(o => o.status === 'Cancelado').length,
    failedPaymentOrders: orders.filter(o => o.status === 'Pago Fallido').length,
  };
};