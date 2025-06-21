import { useState } from 'react';

const useRegistration = () => {
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [success, setSuccess] = useState(false);

  const registerUser = async (userData) => {
    setRegistrationLoading(true);
    setRegistrationError(null);
    setSuccess(false);

    try {
      // Verificar que todos los campos requeridos estén presentes
      if (!userData.password) {
        throw new Error('La contraseña es requerida');
      }
      if (!userData.email) {
        throw new Error('El email es requerido');
      }
      if (!userData.name) {
        throw new Error('El nombre es requerido');
      }

      // Debug: verificar que los datos estén llegando
      console.log('Datos antes de enviar:', {
        name: userData.name,
        email: userData.email,
        password: userData.password ? '[PRESENTE]' : '[AUSENTE]',
        phone: userData.phone,
        address: userData.address
      });

      // Preparar datos para envío
      let requestBody;
      let headers = {};

      if (userData.profileImage) {
        // Si hay imagen, usar FormData
        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('phone', userData.phone);
        formData.append('address', userData.address);
        formData.append('role', 'cliente');
        formData.append('image', userData.profileImage);
        
        requestBody = formData;
        // No establecer Content-Type para FormData
      } else {
        // Si no hay imagen, usar JSON
        requestBody = JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
          address: userData.address,
          role: 'cliente'
        });
        
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: headers,
        body: requestBody
      });

      // Verificar si la respuesta es válida
      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            const textError = await response.text();
            errorMessage = textError || errorMessage;
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      // Intentar parsear la respuesta exitosa
      let data;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const textResponse = await response.text();
          if (textResponse) {
            try {
              data = JSON.parse(textResponse);
            } catch {
              data = { message: textResponse };
            }
          } else {
            data = { message: 'Registro exitoso' };
          }
        }
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        data = { message: 'Registro exitoso' };
      }

      setSuccess(true);
      setRegistrationLoading(false);
      
      // Guardar token si viene en la respuesta
      if (data && data.token) {
        localStorage.setItem('authToken', data.token);
      }

      return {
        success: true,
        data: data,
        message: data?.message || 'Usuario registrado exitosamente'
      };

    } catch (error) {
      console.error('Error en registro:', error);
      setRegistrationError(error.message || 'Error interno del servidor');
      setRegistrationLoading(false);
      
      return {
        success: false,
        error: error.message || 'Error interno del servidor'
      };
    }
  };

  // Función para resetear el estado
  const resetRegistrationState = () => {
    setRegistrationLoading(false);
    setRegistrationError(null);
    setSuccess(false);
  };

  // Función para verificar si el email ya existe
  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`http://localhost:4000/api/check-email?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        return data.exists;
      }
      return false;
    } catch (error) {
      console.error('Error verificando email:', error);
      return false;
    }
  };

  return {
    registerUser,
    registrationLoading,
    registrationError,
    success,
    resetRegistrationState,
    checkEmailExists
  };
};

export default useRegistration;