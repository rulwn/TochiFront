import React, { useRef, useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiUser, FiMail, FiPhone, FiMapPin, FiEdit, FiCamera, FiTrash2 } from 'react-icons/fi';
import { AuthContext } from '../../../context/AuthContext';
import './AdminDetails.css';

function AdminDetails() {
  const navigate = useNavigate();
  const { auth, updateUserProfile, fetchUserDetails } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const DEFAULT_IMAGE_URL = "https://res.cloudinary.com/djrbaveph/image/upload/v1747283422/default_mgkskg.jpg";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  useEffect(() => {
    if (auth.userData) {
      setValue('name', auth.userData.name || '');
      setValue('email', auth.userData.email || '');
      setValue('phone', auth.userData.phone || '');
      setValue('address', auth.userData.address || '');

      // Mostrar imagen solo si no es la predeterminada
      if (auth.userData.imgUrl && auth.userData.imgUrl !== DEFAULT_IMAGE_URL) {
        setProfileImage(auth.userData.imgUrl);
      } else {
        setProfileImage(null);
      }
    }
  }, [auth.userData, setValue]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
      setUploadedFile(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setSuccessMessage(null);
    } else {
      // Restaurar valores originales al entrar en modo edición
      if (auth.userData) {
        reset({
          name: auth.userData.name || '',
          email: auth.userData.email || '',
          phone: auth.userData.phone || '',
          address: auth.userData.address || ''
        });
        setProfileImage(auth.userData.imgUrl && auth.userData.imgUrl !== DEFAULT_IMAGE_URL 
          ? auth.userData.imgUrl 
          : null
        );
      }
    }
  };

 // Reemplaza la función onSubmit con esta versión corregida
const onSubmit = async (data) => {
  setLoading(true);
  setSuccessMessage(null);
  
  try {
    const formData = new FormData();
    
    // Agregar todos los campos necesarios
    formData.append('name', data.name);
    formData.append('phone', data.phone);
    formData.append('address', data.address);
    
    // Manejo de imagen
    if (uploadedFile) {
      formData.append('imageUrl', uploadedFile); // Coincide con el nombre esperado por Multer
    } else if (!profileImage && auth.userData?.imgUrl) {
      // Si se eliminó la imagen existente
      formData.append('removeImage', 'true');
    }
    
    // Usar la ruta correcta para actualizar perfil
    const success = await updateUserProfile(`profile/${auth.userId}`, formData);
    
    if (success) {
      // Refrescar datos del usuario
      await fetchUserDetails(auth.userId);
      setSuccessMessage("Perfil actualizado correctamente");
      setEditMode(false);
      setUploadedFile(null);
    } else {
      throw new Error("Error al actualizar el perfil");
    }
  } catch (error) {
    console.error("Error:", error);
    setSuccessMessage(error.message || "Error al actualizar el perfil");
    
    // Restaurar imagen original en caso de error
    if (auth.userData?.imgUrl) {
      setProfileImage(auth.userData.imgUrl !== DEFAULT_IMAGE_URL 
        ? auth.userData.imgUrl 
        : null
      );
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="admin-details-page">
      <div className="admin-details-container">
        <header className="admin-details-header">
          <button className="admin-back-button" onClick={() => navigate(-1)}>
            <FiChevronLeft /> Volver
          </button>
          <h1>Mis Detalles</h1>
        </header>

        {successMessage && (
          <div className={`admin-details-message ${successMessage.includes("correctamente") ? "success" : "error"}`}>
            {successMessage}
          </div>
        )}

        <div className="admin-profile-card">
          <div className="admin-avatar" onClick={editMode ? handleImageClick : null}>
            {profileImage ? (
              <>
                <img 
                  src={profileImage} 
                  alt="Foto de perfil" 
                  className="admin-profile-image" 
                />
                {editMode && (
                  <div className="admin-avatar-overlay">
                    <FiCamera className="admin-avatar-overlay-icon" />
                    <span>Cambiar foto</span>
                  </div>
                )}
              </>
            ) : (
              <div className="admin-avatar-icon-container">
                <FiUser className="admin-avatar-icon" />
              </div>
            )}
            
            {editMode && profileImage && (
              <button 
                type="button"
                className="admin-remove-photo-button"
                onClick={handleRemoveImage}
                disabled={loading}
              >
                <FiTrash2 /> Quitar foto
              </button>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageChange}
              disabled={!editMode || loading}
            />
          </div>
          
          <div className="admin-info">
            {editMode ? (
              <form className="admin-edit-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="admin-info-item">
                  <FiUser className="admin-info-icon" />
                  <div>
                    <label>Nombre completo</label>
                    <input
                      type="text"
                      {...register("name", {
                        required: "El nombre es requerido",
                        minLength: {
                          value: 3,
                          message: "El nombre debe tener al menos 3 caracteres"
                        }
                      })}
                      className={`admin-edit-input ${errors.name ? "error" : ""}`}
                    />
                    {errors.name && (
                      <span className="admin-error-message">{errors.name.message}</span>
                    )}
                  </div>
                </div>
                
                <div className="admin-info-item">
                  <FiMail className="admin-info-icon" />
                  <div>
                    <label>Correo electrónico</label>
                    <input
                      type="email"
                      value={auth.userData?.email || ''}
                      readOnly
                      className="admin-edit-input readonly"
                    />
                    <small className="admin-edit-note">El correo no se puede modificar aquí</small>
                  </div>
                </div>
                
                <div className="admin-info-item">
                  <FiPhone className="admin-info-icon" />
                  <div>
                    <label>Teléfono</label>
                    <input
                      type="text"
                      {...register("phone", {
                        required: "El teléfono es requerido",
                        pattern: {
                          value: /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
                          message: "Formato de teléfono inválido"
                        }
                      })}
                      className={`admin-edit-input ${errors.phone ? "error" : ""}`}
                    />
                    {errors.phone && (
                      <span className="admin-error-message">{errors.phone.message}</span>
                    )}
                  </div>
                </div>
                
                <div className="admin-info-item">
                  <FiMapPin className="admin-info-icon" />
                  <div>
                    <label>Dirección</label>
                    <input
                      type="text"
                      {...register("address", {
                        required: "La dirección es requerida",
                        minLength: {
                          value: 10,
                          message: "La dirección debe tener al menos 10 caracteres"
                        }
                      })}
                      className={`admin-edit-input ${errors.address ? "error" : ""}`}
                    />
                    {errors.address && (
                      <span className="admin-error-message">{errors.address.message}</span>
                    )}
                  </div>
                </div>
                
                <div className="admin-form-buttons">
                  <button 
                    type="button" 
                    className="admin-cancel-button"
                    onClick={toggleEditMode}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="admin-save-button"
                    disabled={loading}
                  >
                    {loading ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="admin-info-item">
                  <FiUser className="admin-info-icon" />
                  <div>
                    <label>Nombre completo</label>
                    <p>{auth.userData?.name || 'No especificado'}</p>
                  </div>
                </div>
                
                <div className="admin-info-item">
                  <FiMail className="admin-info-icon" />
                  <div>
                    <label>Correo electrónico</label>
                    <p>{auth.userData?.email || 'No especificado'}</p>
                  </div>
                </div>
                
                <div className="admin-info-item">
                  <FiPhone className="admin-info-icon" />
                  <div>
                    <label>Teléfono</label>
                    <p>{auth.userData?.phone || 'No especificado'}</p>
                  </div>
                </div>
                
                <div className="admin-info-item">
                  <div className="admin-info-icon admin-role-icon">
                    <span>{auth.userData?.role?.charAt(0) || 'U'}</span>
                  </div>
                  <div>
                    <label>Tipo de cuenta</label>
                    <p>{auth.userData?.role || 'Usuario'}</p>
                  </div>
                </div>
                
                <div className="admin-info-item">
                  <FiMapPin className="admin-info-icon" />
                  <div>
                    <label>Dirección</label>
                    <p>{auth.userData?.address || 'No especificada'}</p>
                  </div>
                </div>
                
                <button 
                  className="admin-edit-button"
                  onClick={toggleEditMode}
                >
                  <FiEdit /> Editar información
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDetails;