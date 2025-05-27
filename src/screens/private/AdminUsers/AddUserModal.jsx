import React, { useState, useRef } from 'react';
import { LuX, LuUpload } from 'react-icons/lu';
import { useForm } from 'react-hook-form';
import Lottie from 'lottie-react';
import successAnimation from '../../../assets/success-animation.json';

const AddUserModal = ({ onClose, onSave }) => {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    clearErrors,
    watch
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'Cliente',
      address: ''
    },
    mode: 'onChange' // Validación en tiempo real
  });

  const roles = [
    { value: 'Cliente', label: 'Cliente' },
    { value: 'Administrador', label: 'Administrador' }
  ];

  // Validaciones personalizadas
  const validationRules = {
    name: {
      required: 'El nombre es requerido',
      minLength: {
        value: 2,
        message: 'El nombre debe tener al menos 2 caracteres'
      },
      maxLength: {
        value: 50,
        message: 'El nombre no puede tener más de 50 caracteres'
      }
    },
    email: {
      required: 'El email es requerido',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Formato de email inválido'
      }
    },
    password: {
      required: 'La contraseña es requerida',
      minLength: {
        value: 6,
        message: 'La contraseña debe tener al menos 6 caracteres'
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
      }
    },
    phone: {
      required: 'El teléfono es requerido',
      pattern: {
        value: /^[\+]?[0-9\s\-\(\)]{8,15}$/,
        message: 'Formato de teléfono inválido'
      }
    },
    role: {
      required: 'Seleccione un rol'
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.match('image.*')) {
        setFormError('imageFile', { 
          type: 'manual', 
          message: 'Solo se permiten imágenes' 
        });
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormError('imageFile', { 
          type: 'manual', 
          message: 'La imagen debe ser menor a 5MB' 
        });
        return;
      }

      setImageFile(file);
      
      // Crear vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Limpiar error si existe
      if (errors.imageFile) {
        clearErrors('imageFile');
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Datos del formulario en AddUserModal:', data);
      
      // Preparar los datos del usuario
      const userData = {
        ...data,
        imageFile: imageFile
      };

      console.log('Datos completos a enviar:', userData);

      // Llamar al callback onSave que viene desde AdminUsers
      // Este callback se encargará de llamar a createUser
      if (onSave) {
        await onSave(userData);
      }
      
      // Mostrar animación de éxito
      setShowSuccessAnimation(true);
      setTimeout(() => {
        setShowSuccessAnimation(false);
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error('Error en onSubmit:', err);
      setError(err.message || 'Error al crear el usuario. Intente nuevamente.');
      setFormError('submit', { 
        type: 'manual', 
        message: err.message || 'Error al crear el usuario. Intente nuevamente.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay1">
      <div className="modal-content1">
        <button 
          className="modal-close-btn1" 
          onClick={handleModalClose}
          disabled={isLoading}
        >
          <LuX size={20} />
        </button>
        
        <h2 className="modal-title1">Agregar Nuevo Usuario</h2>

        {showSuccessAnimation && (
          <div className="success-animation-container">
            <Lottie animationData={successAnimation} loop={false} />
          </div>
        )}
        
        {!showSuccessAnimation && (
          <div className="modal-body1">
            <form onSubmit={handleSubmit(onSubmit)} className="user-form" noValidate>
              {/* Error general del submit */}
              {errors.submit && (
                <div className="error-message-general" style={{ 
                  backgroundColor: '#fee', 
                  color: '#c33', 
                  padding: '8px 12px', 
                  borderRadius: '4px', 
                  marginBottom: '16px',
                  border: '1px solid #fcc'
                }}>
                  {errors.submit.message}
                </div>
              )}

              {/* Error local del modal */}
              {error && (
                <div className="error-message-general" style={{ 
                  backgroundColor: '#fee', 
                  color: '#c33', 
                  padding: '8px 12px', 
                  borderRadius: '4px', 
                  marginBottom: '16px',
                  border: '1px solid #fcc'
                }}>
                  {error}
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group-user">
                  <label htmlFor="name">Nombre Completo*</label>
                  <input
                    type="text"
                    id="name"
                    {...register('name', validationRules.name)}
                    className={errors.name ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name.message}</span>
                  )}
                </div>
                
                <div className="form-group-user">
                  <label htmlFor="role">Rol*</label>
                  <select
                    id="role"
                    {...register('role', validationRules.role)}
                    className={errors.role ? 'error' : ''}
                    disabled={isLoading}
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <span className="error-message">{errors.role.message}</span>
                  )}
                </div>
              </div>
            
              <div className="form-row">
                <div className="form-group-user">
                  <label htmlFor="email">Email*</label>
                  <input
                    type="email"
                    id="email"
                    {...register('email', validationRules.email)}
                    className={errors.email ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email.message}</span>
                  )}
                </div>
                
                <div className="form-group-user">
                  <label htmlFor="password">Contraseña*</label>
                  <input
                    type="password"
                    id="password"
                    {...register('password', validationRules.password)}
                    className={errors.password ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <span className="error-message">{errors.password.message}</span>
                  )}
                </div>
              </div>
            
              <div className="form-row">
                <div className="form-group-user">
                  <label htmlFor="phone">Teléfono*</label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone', validationRules.phone)}
                    className={errors.phone ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone.message}</span>
                  )}
                </div>
                
                <div className="form-group-user">
                  <label htmlFor="address">Dirección</label>
                  <input
                    type="text"
                    id="address"
                    {...register('address')}
                    disabled={isLoading}
                  />
                </div>
              </div>
            
              <div className="form-group-user">
                <label htmlFor="imageFile">Foto de Perfil</label>
                <div className="file-upload-container">
                  <button 
                    type="button" 
                    className={`file-upload-btn ${errors.imageFile ? 'error' : ''}`}
                    onClick={() => fileInputRef.current.click()}
                    disabled={isLoading}
                  >
                    <LuUpload size={18} />
                    <span>Seleccionar archivo</span>
                  </button>
                  <input
                    type="file"
                    id="imageFile"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                    disabled={isLoading}
                  />
                  {previewImage && (
                    <div className="image-preview">
                      <img src={previewImage} alt="Vista previa" />
                    </div>
                  )}
                  {imageFile && (
                    <div className="file-name">{imageFile.name}</div>
                  )}
                  {errors.imageFile && (
                    <span className="error-message">{errors.imageFile.message}</span>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}
        
        {!showSuccessAnimation && (
          <div className="modal-footer">
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={handleModalClose}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="save-btn" 
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : 'Guardar Usuario'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddUserModal;