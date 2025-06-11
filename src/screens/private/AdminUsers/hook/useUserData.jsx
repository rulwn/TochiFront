import { useState, useCallback } from 'react';

const useUserData = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUsers = 'https://api-rest-bl9i.onrender.com/api/users';
  //const apiUsers = 'http://localhost:4000/api/users'

  // Obtener todos los usuarios
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(apiUsers);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUsers(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Error de conexión al obtener usuarios';
      setError(errorMessage);
      console.error('Error fetching users:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Crear un nuevo usuario
  const createUser = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validaciones básicas antes de enviar
      if (!userData.name || !userData.email || !userData.password) {
        throw new Error('Los campos nombre, email y contraseña son obligatorios');
      }

      // Crear FormData para enviar tanto los datos como la imagen
      const formDataToSend = new FormData();
      
      // Agregar todos los campos del formulario
      formDataToSend.append('name', userData.name);
      formDataToSend.append('email', userData.email);
      formDataToSend.append('password', userData.password);
      formDataToSend.append('phone', userData.phone || '');
      formDataToSend.append('role', userData.role);
      formDataToSend.append('address', userData.address || '');
      
      // Agregar la imagen si existe
      if (userData.imageFile) {
        formDataToSend.append('imageUrl', userData.imageFile);
      }

      console.log('Enviando datos del usuario:', {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        address: userData.address,
        hasImage: !!userData.imageFile
      });

      const response = await fetch(apiUsers, {
        method: 'POST',
        body: formDataToSend,
      });

      let errorData = null;
      let responseText = '';
      
      try {
        responseText = await response.text();
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        console.error('Response text:', responseText);
      }

      if (!response.ok) {
        let errorMessage = 'Error al crear el usuario';
        
        if (errorData) {
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.errors) {
            // Si hay múltiples errores de validación
            const errorMessages = Object.values(errorData.errors).join(', ');
            errorMessage = `Errores de validación: ${errorMessages}`;
          }
        } else {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        
        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          responseText
        });
        
        throw new Error(errorMessage);
      }

      const newUser = errorData || JSON.parse(responseText);
      
      // Actualizar el estado local agregando el nuevo usuario
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      return newUser;
    } catch (err) {
      const errorMessage = err.message || 'Error desconocido al crear el usuario';
      setError(errorMessage);
      console.error('Error creating user:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualizar un usuario
  const updateUser = useCallback(async (userId, userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', userData.name);
      formDataToSend.append('email', userData.email);
      if (userData.password) {
        formDataToSend.append('password', userData.password);
      }
      formDataToSend.append('phone', userData.phone || '');
      formDataToSend.append('role', userData.role);
      formDataToSend.append('address', userData.address || '');
      
      if (userData.imageFile) {
        formDataToSend.append('imageUrl', userData.imageFile);
      }

      const response = await fetch(`${apiUsers}/${userId}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      let errorData = null;
      let responseText = '';
      
      try {
        responseText = await response.text();
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing update response:', parseError);
      }

      if (!response.ok) {
        let errorMessage = 'Error al actualizar el usuario';
        
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        } else {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const updatedUser = errorData || JSON.parse(responseText);
      
      // Actualizar el estado local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? updatedUser : user
        )
      );
      
      return updatedUser;
    } catch (err) {
      const errorMessage = err.message || 'Error al actualizar el usuario';
      setError(errorMessage);
      console.error('Error updating user:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Eliminar un usuario
  const deleteUser = useCallback(async (userId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${apiUsers}/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        let errorMessage = 'Error al eliminar el usuario';
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      // Actualizar el estado local removiendo el usuario
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Error al eliminar el usuario';
      setError(errorMessage);
      console.error('Error deleting user:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener un usuario por ID
  const getUserById = useCallback((userId) => {
    return users.find(user => user._id === userId);
  }, [users]);

  // Filtrar usuarios por rol
  const getUsersByRole = useCallback((role) => {
    return users.filter(user => user.role === role);
  }, [users]);

  // Buscar usuarios por nombre o email
  const searchUsers = useCallback((searchTerm) => {
    if (!searchTerm) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term)
    );
  }, [users]);

  return {
    // Estado
    users,
    isLoading,
    error,
    
    // Acciones CRUD
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    
    // Utilidades
    getUserById,
    getUsersByRole,
    searchUsers,    
    // Setters directos (si necesitas manipular el estado manualmente)
    setUsers
  };
};

export default useUserData;