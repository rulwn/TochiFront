import React, { useRef, useState } from 'react';
import { LuX, LuUpload } from 'react-icons/lu';
import Lottie from 'lottie-react';
import successAnimation from '../../../assets/success-animation.json'; // Asegúrate de tener el archivo
import useProductData from './hook/useProductData';

const AddProductModal = ({ onClose, onSave }) => {
  const fileInputRef = useRef(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const {
    formData,
    errors,
    previewImage,
    categories,
    isLoading,
    handleInputChange,
    handleFileChange,
    createProduct,
    cleanData
  } = useProductData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await createProduct();
    if (success) {
      setShowSuccessAnimation(true);
      setTimeout(() => {
        setShowSuccessAnimation(false);
        onSave?.();
        onClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    cleanData();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={handleClose}>
          <LuX size={20} />
        </button>

        <h2 className="modal-title">Agregar Nuevo Producto</h2>

        {showSuccessAnimation && (
          <div className="success-animation-container">
            <Lottie animationData={successAnimation} loop={false} />
          </div>
        )}

        {!showSuccessAnimation && (
          <div className="modal-body">
            <form onSubmit={handleSubmit} className="product-form" noValidate>
              <div className="form-group-product">
                <label htmlFor="name">Nombre del Producto*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                  required
                  disabled={isLoading}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group-product">
                <label htmlFor="description">Descripción*</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={errors.description ? 'error' : ''}
                  required
                  rows="3"
                  disabled={isLoading}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              <div className="form-row">
                <div className="form-group-product">
                  <label htmlFor="price">Precio ($)*</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0.01"
                    step="0.01"
                    className={errors.price ? 'error' : ''}
                    required
                    disabled={isLoading}
                  />
                  {errors.price && <span className="error-message">{errors.price}</span>}
                </div>

                <div className="form-group-product">
                  <label htmlFor="stock">Stock*</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className={errors.stock ? 'error' : ''}
                    required
                    disabled={isLoading}
                  />
                  {errors.stock && <span className="error-message">{errors.stock}</span>}
                </div>
              </div>

              <div className="form-group-product">
                <label htmlFor="idCategory">Categoría*</label>
                <select
                  id="idCategory"
                  name="idCategory"
                  value={formData.idCategory}
                  onChange={handleInputChange}
                  className={errors.idCategory ? 'error' : ''}
                  required
                  disabled={isLoading}
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.idCategory && <span className="error-message">{errors.idCategory}</span>}
              </div>

              <div className="form-group-product">
                <label htmlFor="imageUrl">Imagen del Producto*</label>
                <div className="file-upload-container">
                  <button
                    type="button"
                    className={`file-upload-btn ${errors.imageUrl ? 'error' : ''}`}
                    onClick={() => fileInputRef.current.click()}
                    disabled={isLoading}
                  >
                    <LuUpload size={18} />
                    <span>Seleccionar archivo</span>
                  </button>
                  <input
                    type="file"
                    id="imageUrl"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                    required
                    disabled={isLoading}
                  />
                  {previewImage && (
                    <div className="image-preview">
                      <img src={previewImage} alt="Vista previa" />
                    </div>
                  )}
                  {formData.imageUrl && (
                    <div className="file-name">{formData.imageUrl.name}</div>
                  )}
                  {errors.imageUrl && <span className="error-message">{errors.imageUrl}</span>}
                </div>
              </div>

              <div className="modal-footer">
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="save-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Guardar Producto'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductModal;
