import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../../context/AuthContext'; // Ajusta la ruta

const useCart = () => {
  const { user, isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Base URL del backend
  //const API_BASE_URL = 'https://api-rest-bl9i.onrender.com';
   const API_BASE_URL = 'http://localhost:4000'; // Para desarrollo local

  // Función para obtener el carrito del usuario desde el backend
  const fetchCart = useCallback(async () => {
    if (!isLoggedIn || !user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/user/${user.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const cart = await response.json();
        if (cart && cart.Products) {
          setCartId(cart._id);
          // Mapear los productos del carrito al formato esperado
          const mappedItems = cart.Products.map(item => ({
            id: item.id || item._id,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            quantity: item.quantity,
            unit: item.unit,
            selectedQuantity: item.selectedQuantity || 1
          }));
          setCartItems(mappedItems);
          setTotal(cart.total || 0);
        }
      } else if (response.status === 404) {
        // No existe carrito, eso está bien
        setCartItems([]);
        setCartId(null);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, user?.id]);

  // Función para crear un nuevo carrito
  const createCart = async (firstProduct) => {
  if (!isLoggedIn || !user?.id) return false;

  try {
    const initialQuantity = firstProduct.selectedQuantity || 1;
    
    const cartData = {
      idClient: user.id,
      Products: [{
        idProduct: firstProduct.id,
        quantity: initialQuantity, // Usar la cantidad del producto
        subtotal: firstProduct.price * initialQuantity
      }]
    };

    const response = await fetch('http://localhost:4000/api/cart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartData),
      credentials: 'include'
    });

    if (response.ok) {
      const newCart = await response.json();
      setCartId(newCart.cart._id);
      setCartItems([{ ...firstProduct, selectedQuantity: initialQuantity }]);
      calculateTotal([{ ...firstProduct, selectedQuantity: initialQuantity }]);
      toast.success('Producto añadido al carrito');
      return true;
    } else {
      throw new Error('Error creating cart');
    }
  } catch (error) {
    console.error('Error creating cart:', error);
    toast.error('Error al crear el carrito');
    return false;
  }
};

  // Función para actualizar el carrito existente
  const updateCart = async (updatedProducts) => {
    if (!cartId || !isLoggedIn) return false;

    try {
      const productsForBackend = updatedProducts.map(product => ({
        idProduct: product.id,
        quantity: product.selectedQuantity || 1,
        subtotal: product.price * (product.selectedQuantity || 1)
      }));

      const response = await fetch(`http://localhost:4000/api/cart/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: productsForBackend }),
        credentials: 'include'
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setTotal(updatedCart.cart.total);
        return true;
      } else {
        throw new Error('Error updating cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Error al actualizar el carrito');
      return false;
    }
  };

  // Función para calcular el total localmente
  const calculateTotal = (items) => {
    const newTotal = items.reduce((acc, item) => {
      return acc + (item.price * (item.selectedQuantity || 1));
    }, 0);
    setTotal(newTotal);
  };

  // Función para añadir producto al carrito
  const addToCart = async (product) => {
  if (!isLoggedIn) {
    toast.error('Debes iniciar sesión para añadir productos al carrito');
    return false;
  }

  // Si no hay carrito, crear uno nuevo
  if (!cartId) {
    return await createCart(product);
  }

  // Si ya existe el producto en el carrito, incrementar cantidad
  const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
  let updatedItems;

  if (existingItemIndex >= 0) {
    updatedItems = [...cartItems];
    // Sumar la cantidad que viene del producto a la cantidad existente
    const newQuantity = (updatedItems[existingItemIndex].selectedQuantity || 1) + (product.selectedQuantity || 1);
    updatedItems[existingItemIndex].selectedQuantity = newQuantity;
  } else {
    // Añadir nuevo producto respetando la cantidad que viene del producto
    const quantityToAdd = product.selectedQuantity || 1;
    updatedItems = [...cartItems, { ...product, selectedQuantity: quantityToAdd }];
  }

  setCartItems(updatedItems);
  calculateTotal(updatedItems);

  // Actualizar en el backend
  const success = await updateCart(updatedItems);
  if (success) {
    toast.success('Producto añadido al carrito');
  }
  return success;
};

  // Función para actualizar cantidad de un producto
  const updateCartItem = async (product, isAdding) => {
    if (!cartId) return false;

    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    if (existingItemIndex === -1) return false;

    let updatedItems = [...cartItems];

    if (isAdding) {
      // Añadir más cantidad
      updatedItems[existingItemIndex].selectedQuantity = 
        (updatedItems[existingItemIndex].selectedQuantity || 1) + 1;
    } else {
      // Decrementar o eliminar
      const currentQuantity = updatedItems[existingItemIndex].selectedQuantity || 1;
      if (currentQuantity <= 1) {
        // Eliminar del carrito
        updatedItems = updatedItems.filter(item => item.id !== product.id);
      } else {
        updatedItems[existingItemIndex].selectedQuantity = currentQuantity - 1;
      }
    }

    setCartItems(updatedItems);
    calculateTotal(updatedItems);

    // Si el carrito queda vacío, eliminarlo del backend
    if (updatedItems.length === 0) {
      return await clearCart();
    }

    // Actualizar en el backend
    return await updateCart(updatedItems);
  };

  // Función para eliminar un producto específico del carrito
  const removeFromCart = async (productId) => {
    if (!cartId) return false;

    const updatedItems = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedItems);
    calculateTotal(updatedItems);

    // Si el carrito queda vacío, eliminarlo del backend
    if (updatedItems.length === 0) {
      return await clearCart();
    }

    // Actualizar en el backend
    const success = await updateCart(updatedItems);
    if (success) {
      toast.success('Producto eliminado del carrito');
    }
    return success;
  };

  // Función para limpiar/eliminar el carrito completo
  const clearCart = async () => {
    if (!cartId || !isLoggedIn) return false;

    try {
      const response = await fetch(`http://localhost:4000/api/cart/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        setCartItems([]);
        setCartId(null);
        setTotal(0);
        toast.success('Carrito vaciado');
        return true;
      } else {
        throw new Error('Error clearing cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Error al vaciar el carrito');
      return false;
    }
  };

  // Función para obtener el número total de items en el carrito
  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + (item.selectedQuantity || 1), 0);
  };

  // Efecto para cargar el carrito cuando el usuario se loguea
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      fetchCart();
    } else {
      // Limpiar estado local cuando no hay usuario logueado
      setCartItems([]);
      setCartId(null);
      setTotal(0);
    }
  }, [isLoggedIn, user?.id, fetchCart]);

  return {
    cartItems,
    cartId,
    total,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartItemsCount,
    // Función de conveniencia para verificar si un producto está en el carrito
    isInCart: (productId) => cartItems.some(item => item.id === productId),
    // Función para obtener la cantidad de un producto específico en el carrito
    getProductQuantity: (productId) => {
      const item = cartItems.find(item => item.id === productId);
      return item ? (item.selectedQuantity || 1) : 0;
    }
  };
};

export default useCart;