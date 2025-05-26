import { useState, useCallback, useEffect } from 'react';


export const useOrderData = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch orders + user data - IGUAL al método original
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // const res = await fetch('http://localhost:4000/api/order');
      const res = await fetch('https://tochi-api.onrender.com/api/order');
      const ordersData = await res.json();

      const mapped = await Promise.all(ordersData.map(async order => {
        const cart = order.cartId;
        if (!cart) return null;

        const userId = cart.idClient;
        let customerName = 'Cliente desconocido';
        let customerEmail = '';
        let customerPhone = '';

        if (userId) {
          try {
            // const userRes = await fetch(`http://localhost:4000/api/users/${userId}`);
            const userRes = await fetch(`https://tochi-api.onrender.com/api/users/${userId}`);
            if (userRes.ok) {
              const userData = await userRes.json();
              customerName = userData.name?.trim() || customerName;
              customerEmail = userData.email || '';
              customerPhone = userData.phone || '';
            }
          } catch {
            // Ignorar error en fetch user
          }
        }

        // Total y cantidad de items (manejar posibles null o indefinidos)
        const total = cart.total ?? (cart.Products?.reduce((sum, p) => sum + (p.subtotal ?? 0), 0) ?? 0);
        const items = cart.Products?.reduce((sum, p) => sum + (p.quantity ?? 0), 0) ?? 0;

        // Fecha en formato local
        const date = cart.createdAt?.$date
          ? new Date(cart.createdAt.$date).toLocaleDateString('es-SV')
          : 'Sin fecha';

        return {
          id: order._id,
          customer: customerName,
          customerEmail,
          customerPhone,
          date,
          status: order.state || 'Pendiente',
          address: order.address || 'Sin dirección',
          items,
          total,
          deliveryType: order.payingMetod || 'Efectivo',
          products: cart.Products || [],
          notes: order.notes || '',
          createdAt: cart.createdAt,
        };
      }));

      setOrders(mapped.filter(Boolean));
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
      // const response = await fetch(`http://localhost:4000/api/order/${orderId}`, {
      const response = await fetch(`https://tochi-api.onrender.com/api/order/${orderId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ state: newStatus })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la orden');
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

  // Función para obtener sugerencia de próximo estado
  const getNextStatusSuggestion = (currentStatus) => {
    switch (currentStatus) {
      case 'Pendiente':
        return 'En proceso';
      case 'En proceso':
        return 'Entregado';
      case 'Entregado':
      case 'Cancelado':
        return 'Pendiente';
      default:
        return '';
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
    
    // Funciones de utilidad
    getFilteredOrders,
    getOrderById,
    getNextStatusSuggestion,
    
    // Estadísticas
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'Pendiente').length,
    processingOrders: orders.filter(o => o.status === 'En proceso').length,
    completedOrders: orders.filter(o => o.status === 'Entregado').length,
    cancelledOrders: orders.filter(o => o.status === 'Cancelado').length,
  };
};