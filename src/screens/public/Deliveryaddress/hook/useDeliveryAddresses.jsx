import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext'; // Ajusta la ruta

const useDeliveryAddresses = () => {
  const { auth } = useAuth(); // Usar el contexto de autenticación
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener token del contexto de autenticación
  const getAuthToken = () => {
    return localStorage.getItem('authToken'); // Usar el mismo nombre que en AuthContext
  };

  // Configuración base para las peticiones
  const apiConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    }
  };

  // Cargar direcciones del usuario
  const loadAddresses = async () => {
    // Verificar que el usuario esté autenticado
    if (!auth.isAuthenticated || !auth.userId) {
      setError('Usuario no autenticado');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/api/users/addresses', {
        method: 'GET',
        headers: apiConfig.headers,
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setAddresses(data.data || []);
      } else {
        setError(data.message || 'Error al cargar direcciones');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error loading addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  // Agregar nueva dirección
  const addAddress = async (newAddress) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/api/users/addresses', {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(newAddress),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setAddresses(data.data || []);
        return { success: true, message: data.message };
      } else {
        setError(data.message || 'Error al agregar dirección');
        return { success: false, message: data.message };
      }
    } catch (err) {
      const errorMsg = 'Error de conexión al agregar dirección';
      setError(errorMsg);
      console.error('Error adding address:', err);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar dirección
  const updateAddress = async (addressId, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:4000/api/users/addresses/${addressId}`, {
        method: 'PUT',
        headers: apiConfig.headers,
        body: JSON.stringify(updatedData),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setAddresses(data.data || []);
        return { success: true, message: data.message };
      } else {
        setError(data.message || 'Error al actualizar dirección');
        return { success: false, message: data.message };
      }
    } catch (err) {
      const errorMsg = 'Error de conexión al actualizar dirección';
      setError(errorMsg);
      console.error('Error updating address:', err);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar dirección
  const deleteAddress = async (addressId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:4000/api/users/addresses/${addressId}`, {
        method: 'DELETE',
        headers: apiConfig.headers,
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setAddresses(data.data || []);
        return { success: true, message: data.message };
      } else {
        setError(data.message || 'Error al eliminar dirección');
        return { success: false, message: data.message };
      }
    } catch (err) {
      const errorMsg = 'Error de conexión al eliminar dirección';
      setError(errorMsg);
      console.error('Error deleting address:', err);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Establecer dirección por defecto
  const setDefaultAddress = async (addressId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:4000/api/users/addresses/${addressId}/default`, {
        method: 'PUT',
        headers: apiConfig.headers,
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setAddresses(data.data || []);
        return { success: true, message: data.message };
      } else {
        setError(data.message || 'Error al establecer dirección por defecto');
        return { success: false, message: data.message };
      }
    } catch (err) {
      const errorMsg = 'Error de conexión al establecer dirección por defecto';
      setError(errorMsg);
      console.error('Error setting default address:', err);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Cargar direcciones solo si el usuario está autenticado
  useEffect(() => {
    if (auth.isAuthenticated && auth.userId) {
      loadAddresses();
    }
  }, [auth.isAuthenticated, auth.userId]);

  return {
    addresses,
    loading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refreshAddresses: loadAddresses
  };
};

export default useDeliveryAddresses;