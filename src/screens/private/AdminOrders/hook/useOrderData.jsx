import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';

export const useOrderData = () => {
  const { auth, authenticatedFetch } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!auth.isAuthenticated) {
      setError('Usuario no autenticado');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await authenticatedFetch('http://localhost:4000/api/order');
      
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
      }
      
      const responseData = await res.json();
      
      // Manejar diferentes formatos de respuesta
      let ordersData = responseData;
      if (responseData && !Array.isArray(responseData)) {
        if (Array.isArray(responseData.data)) {
          ordersData = responseData.data;
        } else if (Array.isArray(responseData.orders)) {
          ordersData = responseData.orders;
        } else {
          throw new Error('Formato de respuesta no reconocido');
        }
      }

      if (!Array.isArray(ordersData)) {
        throw new Error('La respuesta no contiene un array de órdenes válido');
      }

      const mapped = await Promise.all(ordersData.map(async (order) => {
        try {
          if (!order || typeof order !== 'object') {
            console.warn('Orden inválida encontrada:', order);
            return null;
          }

          const cart = order.cartId;
          if (!cart || typeof cart !== 'object') {
            console.warn('Cart inválido para la orden:', order._id);
            return null;
          }

          const userId = cart.idClient;
          let customerName = 'Cliente desconocido';
          let customerEmail = '';
          let customerPhone = '';

          if (userId) {
            try {
              const userRes = await authenticatedFetch(`http://localhost:4000/api/users/${userId}`);
              if (userRes.ok) {
                const userData = await userRes.json();
                customerName = userData.name?.trim() || customerName;
                customerEmail = userData.email || '';
                customerPhone = userData.phone || '';
              }
            } catch (userError) {
              console.warn(`Error obteniendo datos del usuario ${userId}:`, userError);
            }
          }

          // Formatear dirección
          const address = order.address ? 
            `${order.address.street || ''}, ${order.address.city || ''}${order.address.state ? `, ${order.address.state}` : ''}${order.address.zipCode ? `, ${order.address.zipCode}` : ''}` : 
            'Sin dirección';

          // Calcular total y cantidad de items
          const products = Array.isArray(cart.Products) ? cart.Products : [];
          const total = order.finalTotal ?? products.reduce((sum, p) => sum + (p.subtotal ?? 0), 0);
          const items = products.reduce((sum, p) => sum + (p.quantity ?? 0), 0);

          // Formatear fecha
          const date = order.createdAt
            ? new Date(order.createdAt).toLocaleDateString('es-SV', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'Sin fecha';

          // Traducción de métodos de pago
          const paymentMethods = {
            'credit-card': 'Tarjeta de crédito',
            'paypal': 'PayPal',
            'wompi': 'Wompi',
            'payphone': 'PayPhone',
            'bank-transfer': 'Transferencia bancaria',
            'cash': 'Efectivo'
          };

          return {
            id: order._id,
            customer: customerName,
            customerEmail,
            customerPhone,
            date,
            status: order.state || 'Pendiente',
            paymentStatus: order.paymentStatus || 'pending',
            deliveryStatus: order.deliveryStatus || 'pending',
            address,
            items,
            total,
            deliveryType: paymentMethods[order.payingMetod] || order.payingMetod || 'Efectivo',
            deliveryMethod: order.deliveryMethod || 'standard',
            deliveryCost: order.deliveryCost || 0,
            discount: order.discount || 0,
            promoCode: order.promoCode || null,
            products,
            notes: order.notes || '',
            paymentId: order.paymentId || null,
            trackingNumber: order.trackingNumber || null,
            cancelReason: order.cancelReason || null,
            transactionDetails: order.transactionDetails || null,
            createdAt: order.createdAt,
            paymentConfirmedAt: order.paymentConfirmedAt || null,
            deliveryDate: order.deliveryDate || null,
            cancelledAt: order.cancelledAt || null
          };
        } catch (mappingError) {
          console.error('Error procesando orden:', order, mappingError);
          return null;
        }
      }));

      // Filtrar valores null y establecer las órdenes
      const validOrders = mapped.filter(Boolean);
      setOrders(validOrders);
      
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      setError(error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [auth.isAuthenticated, authenticatedFetch]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      if (!auth.isAuthenticated) {
        throw new Error('Usuario no autenticado');
      }

      const response = await authenticatedFetch(`http://localhost:4000/api/order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ state: newStatus })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la orden');
      }

      // Actualizar el estado localmente
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      return true;
    } catch (error) {
      console.error(`Error actualizando estado de la orden ${orderId}:`, error);
      throw error;
    }
  };

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

    await fetchOrders();
    
    return results;
  };

  const getFilteredOrders = (searchTerm, statusFilter) => {
    if (!Array.isArray(orders)) {
      console.warn('Orders no es un array:', orders);
      return [];
    }

    return orders.filter(order => {
      const matchesSearch = 
        (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.paymentId && order.paymentId.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = 
        statusFilter === 'Todas' || 
        (order.status && order.status.toLowerCase() === statusFilter.toLowerCase());

      return matchesSearch && matchesStatus;
    });
  };

  const getOrderById = (orderId) => {
    if (!Array.isArray(orders)) return null;
    return orders.find(order => order.id === orderId);
  };

  const getNextStatusSuggestion = (currentStatus) => {
    const statusFlow = {
      'Pendiente': 'Confirmado',
      'Confirmado': 'Procesando',
      'Procesando': 'Enviado',
      'Enviado': 'Entregado',
      'Entregado': 'Pendiente',
      'Cancelado': 'Pendiente',
      'Pago Fallido': 'Pendiente'
    };
    
    return statusFlow[currentStatus] || '';
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchOrders();
    }
  }, [auth.isAuthenticated, fetchOrders]);

  return {
    orders: Array.isArray(orders) ? orders : [],
    loading,
    error,
    fetchOrders,
    updateOrderStatus,
    updateMultipleOrdersStatus,
    getFilteredOrders,
    getOrderById,
    getNextStatusSuggestion,
    totalOrders: Array.isArray(orders) ? orders.length : 0,
    pendingOrders: Array.isArray(orders) ? orders.filter(o => o.status === 'Pendiente').length : 0,
    processingOrders: Array.isArray(orders) ? orders.filter(o => ['Confirmado', 'Procesando'].includes(o.status)).length : 0,
    completedOrders: Array.isArray(orders) ? orders.filter(o => o.status === 'Entregado').length : 0,
    cancelledOrders: Array.isArray(orders) ? orders.filter(o => o.status === 'Cancelado').length : 0,
  };
};