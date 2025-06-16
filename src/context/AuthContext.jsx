import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

// Exporta el contexto directamente
export const AuthContext = createContext();

// Exporta el Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null); // Datos completos del usuario
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

  // Función para obtener datos completos del usuario
  const fetchUserDetails = async (userId) => {
    if (!userId) return null;
    
    setIsLoadingUserData(true);
    try {
      const response = await fetch(`http://localhost:4000/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al obtener datos del usuario');
      }

      const userData = await response.json();
      setUserDetails(userData);
      return userData;
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error("Error al cargar datos del perfil");
      return null;
    } finally {
      setIsLoadingUserData(false);
    }
  };

  const Login = async (email, password) => {
    if (!email || !password) {
      toast.error("Por favor, completa todos los campos.");
      return false;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el login');
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userEmail', email);

      const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
      
      const userData = {
        email: email,
        role: tokenPayload.role,
        id: tokenPayload.id || tokenPayload.userId,
        name: data.user?.name || '', // Datos básicos del login
        avatar: data.user?.avatar || data.user?.imgUrl || '',
        ...tokenPayload
      };

      setUser(userData);
      setIsLoggedIn(true);
      
      // Cargar datos completos del usuario
      await fetchUserDetails(userData.id);
      
      toast.success("Inicio de sesión exitoso.");
      return { success: true, role: tokenPayload.role };

    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || "Credenciales incorrectas. Por favor, intenta de nuevo.");
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      setUser(null);
      setUserDetails(null);
      setIsLoggedIn(false);
      
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  const logOut = async () => {
    try {
      // Llamar al endpoint de logout si existe
      try {
        await fetch('http://localhost:4000/api/logout', {
          method: 'POST',
          credentials: 'include'
        });
      } catch (error) {
        console.log('Error en logout del servidor:', error);
      }

      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      setUser(null);
      setUserDetails(null);
      setIsLoggedIn(false);
      toast.success("Sesión cerrada.");
      return true;
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión.");
      return false;
    }
  };

  const updateUserProfile = async (updatedData) => {
    if (!user?.id) return false;

    setIsLoadingUserData(true);
    try {
      const response = await fetch(`http://localhost:4000/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al actualizar perfil');
      }

      const updatedUser = await response.json();
      setUserDetails(updatedUser);
      toast.success("Perfil actualizado correctamente");
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Error al actualizar perfil");
      return false;
    } finally {
      setIsLoadingUserData(false);
    }
  };

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('userEmail');
    
    if (token && email) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        
        const currentTime = Date.now() / 1000;
        if (tokenPayload.exp && tokenPayload.exp < currentTime) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userEmail');
          return;
        }

        const userData = {
          email: email,
          role: tokenPayload.role,
          id: tokenPayload.id || tokenPayload.userId,
          ...tokenPayload
        };

        setUser(userData);
        setIsLoggedIn(true);
        
        // Cargar datos completos del usuario
        await fetchUserDetails(userData.id);
      } catch (error) {
        console.error('Error al verificar token:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
      }
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        userDetails, // Datos completos del usuario
        setUser,
        Login, 
        logOut, 
        isLoggedIn, 
        setIsLoggedIn,
        isLoading,
        isLoadingUserData,
        checkAuthStatus,
        fetchUserDetails,
        updateUserProfile,
        // Datos combinados para fácil acceso
        auth: {
          isAuthenticated: isLoggedIn,
          email: user?.email || '',
          role: user?.role || '',
          userData: userDetails,
          userId: user?.id || null
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);