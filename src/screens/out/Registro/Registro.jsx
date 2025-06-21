import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './Registro.css';
import logo from '../../../assets/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import useRegistration from './hook/useRegistration';

function Registro() {
  const navigate = useNavigate();
  const { registerUser, registrationLoading, registrationError, success } = useRegistration();
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors
  } = useForm();

  // Observar el campo de email para validación en tiempo real
  const watchEmail = watch('email');

  const onSubmit = async (data) => {
    try {
      // Validar campos antes de enviar
      const requiredFields = ['name', 'email', 'password', 'phone', 'address'];
      const missingFields = requiredFields.filter(field => !data[field]?.trim());
      
      if (missingFields.length > 0) {
        setError('general', {
          type: 'manual',
          message: `Los siguientes campos son requeridos: ${missingFields.join(', ')}`
        });
        return;
      }

      // Agregar imagen de perfil si existe
      const registrationData = {
        ...data,
        profileImage: profileImage
      };

      console.log('Enviando datos de registro:', {
        ...registrationData,
        profileImage: profileImage ? 'Archivo seleccionado' : 'Sin imagen'
      });

      const result = await registerUser(registrationData);
      
      if (result.success) {
        console.log('Registro exitoso:', result);
        // Redirigir después del registro exitoso
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Registro exitoso. Ya puedes iniciar sesión.',
              email: data.email 
            }
          });
        }, 2000);
      } else {
        console.error('Error en registro:', result.error);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      setError('general', {
        type: 'manual',
        message: error.message || 'Error inesperado durante el registro'
      });
    }
  };

  // Manejar selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('profileImage', {
          type: 'manual',
          message: 'Solo se permiten archivos JPG, JPEG o PNG'
        });
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('profileImage', {
          type: 'manual',
          message: 'La imagen no debe superar los 5MB'
        });
        return;
      }

      clearErrors('profileImage');
      setProfileImage(file);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejar eliminación de imagen
  const handleRemoveImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setProfileImage(null);
    setImagePreview(null);
    clearErrors('profileImage');
    
    // Limpiar el input file
    const fileInput = document.querySelector('.registro-file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Pantalla de éxito
  if (success) {
    return (
      <div className="registro-container">
        <div className="registro-form-card">
          <img src={logo} alt="Tochi Logo" className="registro-logo" />
          <h2 className="registro-success-title">¡Registro exitoso!</h2>
          <p className="registro-success-text">Tu cuenta ha sido creada correctamente.</p>
          <p className="registro-success-text">Redirigiendo al inicio de sesión...</p>
          <div className="registro-loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="registro-container">
      <div className="registro-form-card">
        <img src={logo} alt="Tochi Logo" className="registro-logo" />
        <h2 className="registro-title">Sign Up</h2>
        <p className="registro-subtitle">Enter your credentials to continue</p>
        
        {registrationError && (
          <div className="registro-error-message">
            {registrationError}
          </div>
        )}

        {errors.general && (
          <div className="registro-error-message">
            {errors.general.message}
          </div>
        )}

        <form className="registro-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Campo de imagen de perfil (opcional) - PRIMERO */}
          <div className="registro-image-upload-section">
            <label className="registro-form-label">Foto de perfil (opcional)</label>
            <div className="registro-image-upload-container">
              {imagePreview ? (
                <div className="registro-image-preview">
                  <img src={imagePreview} alt="Preview" className="registro-preview-image" />
                  <button 
                    type="button" 
                    onClick={handleRemoveImage}
                    className="registro-remove-image-btn"
                    title="Quitar imagen"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="registro-image-placeholder">
                  <span className="registro-image-placeholder-icon">📷</span>
                  <p className="registro-image-placeholder-text">Agregar foto</p>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageChange}
                className="registro-file-input"
                disabled={registrationLoading}
              />
            </div>
            {errors.profileImage && (
              <span className="registro-error-text">{errors.profileImage.message}</span>
            )}
          </div>

          <label className="registro-form-label">Username</label>
          <input 
            type="text" 
            placeholder="Raúl Ochoa" 
            disabled={registrationLoading}
            className={`registro-form-input ${
              registrationLoading ? 'registro-input-disabled' : ''
            } ${
              errors.name ? 'registro-input-error' : ''
            }`}
            {...register('name', {
              required: 'El nombre es obligatorio',
              minLength: {
                value: 2,
                message: 'El nombre debe tener al menos 2 caracteres'
              },
              maxLength: {
                value: 50,
                message: 'El nombre no debe superar los 50 caracteres'
              },
              pattern: {
                value: /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/,
                message: 'El nombre solo debe contener letras y espacios'
              }
            })}
          />
          {errors.name && <span className="registro-error-text">{errors.name.message}</span>}

          <label className="registro-form-label">Email</label>
          <input 
            type="email" 
            placeholder="raulochoa@gmail.com" 
            disabled={registrationLoading}
            className={`registro-form-input ${
              registrationLoading ? 'registro-input-disabled' : ''
            } ${
              errors.email ? 'registro-input-error' : ''
            }`}
            {...register('email', {
              required: 'El email es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Ingresa un email válido'
              },
              validate: {
                notEmpty: value => value.trim() !== '' || 'El email no puede estar vacío'
              }
            })}
          />
          {errors.email && <span className="registro-error-text">{errors.email.message}</span>}

          <label className="registro-form-label">Dirección</label>
          <input 
            type="text" 
            placeholder="San Salvador, calle 26, av 37." 
            disabled={registrationLoading}
            className={`registro-form-input ${
              registrationLoading ? 'registro-input-disabled' : ''
            } ${
              errors.address ? 'registro-input-error' : ''
            }`}
            {...register('address', {
              required: 'La dirección es obligatoria',
              minLength: {
                value: 10,
                message: 'La dirección debe tener al menos 10 caracteres'
              },
              maxLength: {
                value: 100,
                message: 'La dirección no debe superar los 100 caracteres'
              }
            })}
          />
          {errors.address && <span className="registro-error-text">{errors.address.message}</span>}

          <label className="registro-form-label">Teléfono</label>
          <input 
            type="tel" 
            placeholder="+503 7234-3394" 
            disabled={registrationLoading}
            className={`registro-form-input ${
              registrationLoading ? 'registro-input-disabled' : ''
            } ${
              errors.phone ? 'registro-input-error' : ''
            }`}
            {...register('phone', {
              required: 'El teléfono es obligatorio',
              pattern: {
                value: /^[\d\s\+\-\(\)]+$/,
                message: 'El teléfono solo debe contener números y caracteres de formato'
              },
              minLength: {
                value: 8,
                message: 'El teléfono debe tener al menos 8 dígitos'
              }
            })}
          />
          {errors.phone && <span className="registro-error-text">{errors.phone.message}</span>}

          <label className="registro-form-label">Password</label>
          <input 
            type="password" 
            placeholder="********" 
            disabled={registrationLoading}
            className={`registro-form-input ${
              registrationLoading ? 'registro-input-disabled' : ''
            } ${
              errors.password ? 'registro-input-error' : ''
            }`}
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres'
              },
              maxLength: {
                value: 50,
                message: 'La contraseña no debe superar los 50 caracteres'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                message: 'La contraseña debe tener al menos 1 mayúscula, 1 minúscula y 1 número'
              }
            })}
          />
          {errors.password && <span className="registro-error-text">{errors.password.message}</span>}

          <div className="registro-terms">
            By continuing you agree to our{' '}
            <Link to="/termsAndConditions" className="registro-terms-link">Terms of Service</Link> and{' '}
            <Link to="/termsAndConditions" className="registro-terms-link">Privacy Policy</Link>.
          </div>

          <button 
            type="submit" 
            disabled={registrationLoading}
            className={`registro-submit-btn ${registrationLoading ? 'registro-btn-loading' : ''}`}
          >
            {registrationLoading ? 'Creating account...' : 'Sign Up'}
          </button>

          <p className="registro-signin-link">
            Already have an account? <Link to="/login" className="registro-signin-link-anchor">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Registro;