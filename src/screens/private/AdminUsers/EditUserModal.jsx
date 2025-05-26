import React, { useState, useRef, useEffect } from 'react';
import { LuX, LuUpload } from 'react-icons/lu';
import Lottie from 'lottie-react';
import successAnimation from '../../../assets/success-animation.json';

const EditUserModal = ({ user, onClose, onSave, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'Cliente',
    address: '',
    imgUrl: '',
    imageFile: null
  });

  const [errors, setErrors] = useState({});
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  // isLoading viene como prop desde el componente padre
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const roles = [
    { value: 'Cliente', label: 'Cliente' },
    { value: 'Empleado', label: 'Empleado' },
    { value: 'Administrador', label: 'Administrador' }
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', 
        phone: user.phone || '',
        role: user.role || 'Cliente',
        address: user.address || '',
        imgUrl: user.imgUrl || '',
        imageFile: null
      });
      
      if (user.imgUrl) {
        setPreviewImage(user.imgUrl);
      }
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // La contraseña es opcional en edición, pero si se proporciona debe ser válida
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }
    
    if (!formData.role) {
      newErrors.role = 'Seleccione un rol';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error al cambiar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.match('image.*')) {
        setErrors(prev => ({ ...prev, imageFile: 'Solo se permiten imágenes' }));
        return;
      }
      
      // Validar tamaño (ejemplo: máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imageFile: 'La imagen debe ser menor a 2MB' }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));
      
      // Crear vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Limpiar error si existe
      if (errors.imageFile) {
        setErrors(prev => ({ ...prev, imageFile: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Preparar datos para envío
      const dataToSend = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        address: formData.address.trim(),
      };

      // Solo incluir contraseña si se proporcionó una nueva
      if (formData.password && formData.password.trim()) {
        dataToSend.password = formData.password;
      }

      // Incluir archivo de imagen si se seleccionó uno nuevo
      if (formData.imageFile) {
        dataToSend.imageFile = formData.imageFile;
      }

      console.log('Datos a enviar en EditUserModal:', dataToSend);

      // Llamar a la función onSave que manejará la actualización desde el componente padre
      await onSave(dataToSend);
      
      console.log('onSave completado exitosamente');
      
      // Mostrar animación de éxito
      setShowSuccessAnimation(true);
      
      // No cerrar inmediatamente, dejar que el setTimeout maneje el cierre
      setTimeout(() => {
        setShowSuccessAnimation(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error al actualizar usuario en modal:', error);
      
      // Manejar errores específicos
      if (error.message && error.message.includes('email')) {
        setErrors(prev => ({ ...prev, email: 'Este email ya está en uso' }));
      } else {
        setErrors(prev => ({ 
          ...prev, 
          general: error.message || 'Error al actualizar usuario. Intente nuevamente.' 
        }));
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      imageFile: null,
      imgUrl: ''
    }));
    setPreviewImage(null);
    
    // Limpiar el input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleModalClose = () => {
    if (!isLoading && !showSuccessAnimation) {
      onClose();
    }
  };

  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button 
          className="modal-close-btn" 
          onClick={handleModalClose}
          disabled={isLoading || showSuccessAnimation}
        >
          <LuX size={20} />
        </button>
        
        <h2 className="modal-title">Editar Usuario</h2>

        {showSuccessAnimation && (
          <div className="success-animation-container">
            <Lottie animationData={successAnimation} loop={false} />
          </div>
        )}
        
        {!showSuccessAnimation && (
          <div className="modal-body">
            {errors.general && (
              <div className="general-error-message">
                {errors.general}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="user-form" noValidate>
              <div className="form-row">
                <div className="form-group-user">
                  <label htmlFor="name">Nombre Completo*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                    disabled={isLoading}
                    required
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                
                <div className="form-group-user">
                  <label htmlFor="role">Rol*</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={errors.role ? 'error' : ''}
                    disabled={isLoading}
                    required
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {errors.role && <span className="error-message">{errors.role}</span>}
                </div>
              </div>
            
              <div className="form-row">
                <div className="form-group-user">
                  <label htmlFor="email">Email*</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    disabled={isLoading}
                    required
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-group-user">
                  <label htmlFor="password">Nueva Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="Dejar vacío para mantener actual"
                    disabled={isLoading}
                  />
                  <small className="field-hint">Mínimo 6 caracteres. Dejar vacío para no cambiar.</small>
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
              </div>
            
              <div className="form-row">
                <div className="form-group-user">
                  <label htmlFor="phone">Teléfono*</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                    disabled={isLoading}
                    required
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
                
                <div className="form-group-user">
                  <label htmlFor="address">Dirección</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
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
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <LuUpload size={18} />
                    <span>Seleccionar nueva imagen</span>
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
                      <button 
                        type="button" 
                        className="remove-image-btn"
                        onClick={handleRemoveImage}
                        disabled={isLoading}
                      >
                        <LuX size={16} />
                      </button>
                    </div>
                  )}
                  
                  {formData.imageFile && (
                    <div className="file-name">
                      Nueva imagen: {formData.imageFile.name}
                    </div>
                  )}
                  
                  {errors.imageFile && <span className="error-message">{errors.imageFile}</span>}
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
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LuUpload size={16} className="spinner" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditUserModal;