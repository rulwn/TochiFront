import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../../context/AuthContext';
import useCart from '../../Cart/hook/useCart'; // Importar el hook del carrito

const useCheckout = () => {
  const { user, isLoggedIn } = useAuth();
  const { cartId, cartItems, total, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCreated, setOrderCreated] = useState(null);

  // Base URL del backend
  const API_BASE_URL = 'http://localhost:4000';

  // Validar datos del checkout antes de procesar
  const validateCheckoutData = (checkoutData) => {
    const { deliveryAddress, paymentMethod, deliveryMethod } = checkoutData;

    if (!deliveryAddress) {
      throw new Error('Debe seleccionar una dirección de entrega');
    }

    if (!paymentMethod) {
      throw new Error('Debe seleccionar un método de pago');
    }

    if (!deliveryMethod) {
      throw new Error('Debe seleccionar un método de entrega');
    }

    if (!cartId || cartItems.length === 0) {
      throw new Error('El carrito está vacío');
    }

    if (!isLoggedIn || !user?.id) {
      throw new Error('Debe iniciar sesión para proceder con la compra');
    }

    return true;
  };

  // Función para crear la orden
  const createOrder = async (checkoutData) => {
    try {
      const orderData = {
        cartId: cartId,
        address: {
          street: checkoutData.deliveryAddress.street,
          city: checkoutData.deliveryAddress.city,
          state: checkoutData.deliveryAddress.state,
          zipCode: checkoutData.deliveryAddress.zip,
          country: checkoutData.deliveryAddress.country,
          addressName: checkoutData.deliveryAddress.name
        },
        payingMetod: checkoutData.paymentMethod, // Mantengo el typo del backend
        deliveryMethod: checkoutData.deliveryMethod,
        deliveryCost: checkoutData.deliveryCost || 0,
        discount: checkoutData.appliedDiscount || 0,
        finalTotal: checkoutData.finalTotal || total
      };

      const response = await fetch(`${API_BASE_URL}/api/order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la orden');
      }

      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  // Función principal para procesar el checkout
  const processCheckout = useCallback(async (checkoutData) => {
    setIsProcessing(true);
    
    try {
      // Validar datos del checkout
      validateCheckoutData(checkoutData);

      // Aquí es donde más adelante se integrará la pasarela de pagos
      // Por ahora simulamos un pago exitoso
      const paymentResult = await simulatePayment(checkoutData);
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Error en el procesamiento del pago');
      }

      // Si el pago es exitoso, crear la orden
      const order = await createOrder({
        ...checkoutData,
        paymentId: paymentResult.paymentId, // ID del pago para referencia
        paymentStatus: paymentResult.status
      });

      // Limpiar el carrito después de crear la orden exitosamente
      await clearCart();

      setOrderCreated(order);
      toast.success('¡Orden creada exitosamente!');
      
      return {
        success: true,
        order: order,
        paymentId: paymentResult.paymentId
      };

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Error al procesar la compra');
      
      return {
        success: false,
        error: error.message
      };
    } finally {
      setIsProcessing(false);
    }
  }, [cartId, cartItems, total, isLoggedIn, user?.id, clearCart]);

  // Función para simular pago (será reemplazada por la integración real)
  const simulatePayment = async (checkoutData) => {
    // Simular delay de procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular éxito del pago (puedes cambiar esto para probar errores)
    return {
      success: true,
      paymentId: `payment_${Date.now()}`, // ID simulado
      status: 'completed',
      amount: checkoutData.finalTotal,
      method: checkoutData.paymentMethod
    };
  };

  // Función preparada para integrar Wompi
  const processWompiPayment = async (checkoutData) => {
    // Esta función será implementada cuando integres Wompi
    try {
      const wompiData = {
        amount_in_cents: Math.round(checkoutData.finalTotal * 100), // Wompi maneja centavos
        currency: 'COP', // o la moneda que uses
        customer_email: user.email,
        payment_method: {
          type: 'CARD',
          // Aquí irían los datos de la tarjeta capturados del frontend
        },
        reference: `order_${Date.now()}`,
        redirect_url: `${window.location.origin}/checkout/success`
      };

      // const response = await fetch('https://production.wompi.co/v1/transactions', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${WOMPI_PRIVATE_KEY}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(wompiData)
      // });

      // return await response.json();
      
      // Por ahora retorna simulación
      return await simulatePayment(checkoutData);
    } catch (error) {
      throw new Error('Error procesando pago con Wompi: ' + error.message);
    }
  };

  // Función preparada para integrar Payphone
  const processPayphonePayment = async (checkoutData) => {
    // Esta función será implementada cuando integres Payphone
    try {
      const payphoneData = {
        amount: checkoutData.finalTotal,
        currency: 'USD', // o la moneda que uses
        clientTransactionId: `order_${Date.now()}`,
        // Otros parámetros específicos de Payphone
      };

      // Aquí irá la integración real con Payphone
      // Por ahora retorna simulación
      return await simulatePayment(checkoutData);
    } catch (error) {
      throw new Error('Error procesando pago con Payphone: ' + error.message);
    }
  };

  // Función para obtener órdenes del usuario
  const getUserOrders = useCallback(async () => {
    if (!isLoggedIn || !user?.id) return [];

    try {
      const response = await fetch(`${API_BASE_URL}/api/order/user/${user.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const orders = await response.json();
        return orders;
      } else {
        throw new Error('Error al obtener las órdenes');
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
      toast.error('Error al cargar las órdenes');
      return [];
    }
  }, [isLoggedIn, user?.id]);

  // Función para actualizar el estado de una orden
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: newStatus }),
        credentials: 'include'
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        toast.success('Estado de la orden actualizado');
        return updatedOrder;
      } else {
        throw new Error('Error al actualizar la orden');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Error al actualizar el estado de la orden');
      throw error;
    }
  };

  // Reset del estado del checkout
  const resetCheckout = () => {
    setOrderCreated(null);
    setIsProcessing(false);
  };

  return {
    // Estados
    isProcessing,
    orderCreated,
    
    // Funciones principales
    processCheckout,
    getUserOrders,
    updateOrderStatus,
    resetCheckout,
    
    // Funciones de pago (preparadas para futuras integraciones)
    processWompiPayment,
    processPayphonePayment,
    
    // Datos del carrito
    cartItems,
    cartTotal: total,
    hasItems: cartItems.length > 0,
    
    // Validaciones
    canProceedToCheckout: isLoggedIn && cartItems.length > 0 && cartId
  };
};

export default useCheckout;