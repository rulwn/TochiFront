import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const Login = async (email, password) => {
    if (!email || !password) {
      toast.error("Por favor, completa todos los campos.");
      return false;
    }

    setIsLoading(true);
    
    try {
        //const response = await fetch('', {
      const response = await fetch('https://tochi-api.onrender.com/api/login', {
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

      // Guardar token y email en localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userEmail', email);

      // Decodificar el token para obtener información del usuario
      const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
      
      // Establecer estado del usuario
      const userData = {
        email: email,
        role: tokenPayload.role,
        id: tokenPayload.id || tokenPayload.userId,
        ...tokenPayload // incluir cualquier otra información del token
      };

      setUser(userData);
      setIsLoggedIn(true);
      
      toast.success("Inicio de sesión exitoso.");
      return { success: true, role: tokenPayload.role };

    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || "Credenciales incorrectas. Por favor, intenta de nuevo.");
      
      // Limpiar almacenamiento en caso de error
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      setUser(null);
      setIsLoggedIn(false);
      
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  const logOut = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      setUser(null);
      setIsLoggedIn(false);
      toast.success("Sesión cerrada.");
      return true;
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión.");
      return false;
    }
  };

  // Verificar si hay una sesión activa al cargar la aplicación
  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('userEmail');
    
    if (token && email) {
      try {
        // Verificar si el token es válido decodificándolo
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        
        // Verificar si el token no ha expirado
        const currentTime = Date.now() / 1000;
        if (tokenPayload.exp && tokenPayload.exp < currentTime) {
          // Token expirado, limpiar storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('userEmail');
          return;
        }

        // Token válido, restaurar estado
        const userData = {
          email: email,
          role: tokenPayload.role,
          id: tokenPayload.id || tokenPayload.userId,
          ...tokenPayload
        };

        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error al verificar token:', error);
        // Token inválido, limpiar storage
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
        setUser, // Exportar setUser
        Login, 
        logOut, 
        isLoggedIn, 
        setIsLoggedIn, // Exportar setIsLoggedIn
        isLoading,
        checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);