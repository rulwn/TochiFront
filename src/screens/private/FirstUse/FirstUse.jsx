import React from 'react';
import { useForm } from 'react-hook-form';
import './FirstUse.css';    
import logo from '../../../assets/LogoBlanco.png';
import { Link } from 'react-router-dom';
import useAdminCreation from './hook/useAdminData';

function FirstUse({ onAdminCreated }) {
  const { createAdmin, creationLoading, creationError, success } = useAdminCreation();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    const result = await createAdmin(data);
    
    if (result.success && onAdminCreated) {
      // Crear objeto con información del admin creado
      const adminData = {
        email: data.email,
        name: data.name,
        id: result.data?.id || result.data?.userId,
        role: 'administrador',
        address: data.address,
        phone: data.phone
      };

      setTimeout(() => {
        onAdminCreated(adminData);
      }, 2000);
    }
  };

  // Pantalla de éxito
  if (success) {
    return (
      <div className="firstuse-container">
        <div className="firstuse-card">
          <img src={logo} alt="Tochi Logo" className="firstuse-logo" />
          <h2>¡Administrador creado exitosamente!</h2>
          <p>Redirigiendo al dashboard...</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Formulario principal
  return (
    <div className="firstuse-container">
      <div className="firstuse-card">
        <img src={logo} alt="Tochi Logo" className="firstuse-logo" />
        <h2>Configuración inicial</h2>
        <p>Crea el primer administrador del sistema</p>
        
        {creationError && (
          <div className="error-message">
            {creationError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Nombre completo</label>
          <input 
            type="text" 
            placeholder="Raúl Ochoa" 
            disabled={creationLoading}
            {...register('name', {
              required: 'El nombre es obligatorio',
              pattern: {
                value: /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/,
                message: 'El nombre solo debe contener letras'
              }
            })}
          />
          {errors.name && <span className="error-text">{errors.name.message}</span>}
         
          <label>Email</label>
          <input 
            type="email" 
            placeholder="raulochoa@gmail.com" 
            disabled={creationLoading}
            {...register('email', {
              required: 'El email es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Ingresa un email válido'
              }
            })}
          />
          {errors.email && <span className="error-text">{errors.email.message}</span>}
         
          <label>Dirección</label>
          <input 
            type="text" 
            placeholder="San Salvador, calle 26, av 37." 
            disabled={creationLoading}
            {...register('address', {
              required: 'La dirección es obligatoria',
              minLength: {
                value: 10,
                message: 'La dirección debe tener al menos 10 caracteres'
              }
            })}
          />
          {errors.address && <span className="error-text">{errors.address.message}</span>}
         
          <label>Teléfono</label>
          <input 
            type="tel" 
            placeholder="+503 7234-3394" 
            disabled={creationLoading}
            {...register('phone', {
              required: 'El teléfono es obligatorio',
              pattern: {
                value: /^[\d\s\+\-\(\)]+$/,
                message: 'El teléfono solo debe contener números y caracteres de formato'
              }
            })}
          />
          {errors.phone && <span className="error-text">{errors.phone.message}</span>}
         
          <label>Contraseña</label>
          <input 
            type="password" 
            placeholder="********" 
            disabled={creationLoading}
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                message: 'La contraseña debe tener al menos 1 mayúscula, 1 minúscula y 1 número'
              }
            })}
          />
          {errors.password && <span className="error-text">{errors.password.message}</span>}
         
          <div className="firstuse-terms">
            Al continuar aceptas nuestros{' '}
            <Link to="/termsAndConditions">Términos de Servicio</Link> y{' '}
            <Link to="/termsAndConditions">Política de Privacidad</Link>.
          </div>
          
          <button 
            type="submit" 
            disabled={creationLoading}
            className={creationLoading ? 'loading' : ''}
          >
            {creationLoading ? 'Creando administrador...' : 'Crear Administrador'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FirstUse;