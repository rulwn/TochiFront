// hooks/useAdminData.js
import { useState, useEffect } from 'react';

const useAdminData = () => {
  // Estados para verificación de admin existente
  const [adminExists, setAdminExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para creación de admin
  const [creationLoading, setCreationLoading] = useState(false);
  const [creationError, setCreationError] = useState('');
  const [success, setSuccess] = useState(false);

  const checkAdminExists = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('https://tochi-api.onrender.com/api/users');
      
      if (!response.ok) {
        throw new Error('Error al verificar administradores');
      }

      const data = await response.json();
      
      // Verificar si existe al menos un usuario con rol de administrador
      const hasAdmin = data.some(user => 
        user.role === 'Administrador' || 
        user.role === 'administrador' ||
        user.role === 'admin'
      );

      setAdminExists(hasAdmin);
      
    } catch (err) {
      console.error('Error verificando administrador:', err);
      setError(err.message);
      // En caso de error, asumir que no hay admin para mostrar el formulario
      setAdminExists(false);
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async (adminData) => {
    setCreationLoading(true);
    setCreationError('');
    setSuccess(false);

    try {
      const response = await fetch('https://tochi-api.onrender.com/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...adminData,
          role: 'Administrador'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Después de crear el admin, verificar nuevamente
        await checkAdminExists();
        
        // Retornar la información completa del usuario creado
        return { 
          success: true, 
          data: {
            ...data,
            // Asegurar que el email esté incluido
            email: adminData.email,
            name: adminData.name,
            address: adminData.address,
            phone: adminData.phone
          }
        };
      } else {
        const errorMessage = data.message || 'Error al crear el administrador';
        setCreationError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = 'Error de conexión. Intenta nuevamente.';
      setCreationError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setCreationLoading(false);
    }
  };

  // Función para volver a verificar después de crear un admin
  const recheckAdmin = () => {
    checkAdminExists();
  };

  const resetState = () => {
    setCreationLoading(false);
    setCreationError('');
    setSuccess(false);
  };

  // Verificar al montar el componente
  useEffect(() => {
    checkAdminExists();
  }, []);

  return {
    // Estados de verificación
    adminExists,
    loading,
    error,
    recheckAdmin,
    
    // Estados de creación
    createAdmin,
    creationLoading,
    creationError,
    success,
    resetState
  };
};

export default useAdminData;