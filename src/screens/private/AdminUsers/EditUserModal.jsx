import React, { useState, useRef, useEffect } from 'react';
import { LuX, LuUpload } from 'react-icons/lu';

const EditUserModal = ({ user, onClose, onSave }) => {
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
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const roles = [
    { value: 'Cliente', label: 'Cliente' },
    { value: 'Empleado', label: 'Empleado' },
    { value: 'Admin', label: 'Administrador' }
  ];

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: user.password || '',
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
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) 
      newErrors.email = 'Email inválido';
    if (!formData.password || formData.password.length < 6) 
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!formData.role) newErrors.role = 'Seleccione un rol';
    
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
        imageFile: file,
        imgUrl: URL.createObjectURL(file)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        _id: user._id // Mantener el mismo ID
      });
    }
  };

  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          <LuX size={20} />
        </button>
        
        <h2 className="modal-title">Editar Usuario</h2>
        
        <div className="modal-body">
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
                  required
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group-user">
                <label htmlFor="password">Contraseña*</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  required
                />
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
                />
                {previewImage && (
                  <div className="image-preview">
                    <img src={previewImage} alt="Vista previa" />
                  </div>
                )}
                {formData.imageFile && (
                  <div className="file-name">{formData.imageFile.name}</div>
                )}
                {errors.imageFile && <span className="error-message">{errors.imageFile}</span>}
              </div>
            </div>
          </form>
        </div>
        
        <div className="modal-footer">
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save-btn" onClick={handleSubmit}>
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;