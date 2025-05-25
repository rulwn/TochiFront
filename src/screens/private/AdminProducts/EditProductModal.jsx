import React, { useState, useRef, useEffect } from 'react';
import { LuX, LuUpload } from 'react-icons/lu';
import useProductData from './hook/useProductData';

const EditProductModal = ({ product, onClose, onSave }) => {
  // Usar el hook personalizado
  const { 
    categories, 
    updateProduct, 
    isLoading,
    getCategoryNameById,
    getCategoryIdByName 
  } = useProductData();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    idCategory: '',
    imageFile: null
  });

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (product && categories.length > 0) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        idCategory: product.idCategory || '',
        imageFile: null
      });
      
      if (product.imageUrl) {
        setPreviewImage(product.imageUrl);
      }
    }
  }, [product, categories]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) 
      newErrors.price = 'Precio inválido';
    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) 
      newErrors.stock = 'Stock inválido';
    if (!formData.idCategory) newErrors.idCategory = 'Seleccione una categoría';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setErrors(prev => ({ ...prev, imageFile: 'Solo se permiten imágenes' }));
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imageFile: 'La imagen debe ser menor a 2MB' }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      if (errors.imageFile) {
        setErrors(prev => ({ ...prev, imageFile: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        idCategory: formData.idCategory,
        imageFile: formData.imageFile 
      };
    
      const success = await updateProduct(product._id, productData);
      if (success) {
        onSave(); 
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose} disabled={isLoading}>
          <LuX size={20} />
        </button>
        
        <h2 className="modal-title">Editar Producto</h2>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="product-form" noValidate>
            <div className="form-group">
              <label htmlFor="name">Nombre del Producto*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                required
                disabled={isLoading}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          
            <div className="form-group">
              <label htmlFor="description">Descripción*</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'error' : ''}
                required
                rows="3"
                disabled={isLoading}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
          
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Precio ($)*</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  className={errors.price ? 'error' : ''}
                  required
                  disabled={isLoading}
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="stock">Stock*</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className={errors.stock ? 'error' : ''}
                  required
                  disabled={isLoading}
                />
                {errors.stock && <span className="error-message">{errors.stock}</span>}
              </div>
            </div>
          
            <div className="form-group">
              <label htmlFor="idCategory">Categoría*</label>
              <select
                id="idCategory"
                name="idCategory"
                value={formData.idCategory}
                onChange={handleChange}
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
          
            <div className="form-group">
              <label htmlFor="imageFile">Imagen del Producto</label>
              <div className="file-upload-container">
                <button 
                  type="button" 
                  className={`file-upload-btn ${errors.imageFile ? 'error' : ''}`}
                  onClick={() => fileInputRef.current.click()}
                  disabled={isLoading}
                >
                  <LuUpload size={18} />
                  <span>Cambiar imagen</span>
                </button>
                <input
                  type="file"
                  id="imageFile"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                {(previewImage || product.imageUrl) && (
                  <div className="image-preview">
                    <img src={previewImage || product.imageUrl} alt="Vista previa" />
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
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
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
              {isLoading ? 'Actualizando...' : 'Actualizar Producto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;