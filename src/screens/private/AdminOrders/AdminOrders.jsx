import React, { useEffect, useRef, useState } from 'react';
import { LuX, LuUpload } from 'react-icons/lu';
import Lottie from 'lottie-react';
import successAnimation from '../../../assets/success-animation.json';
import useProductData from './hook/useProductData';
import { useForm } from 'react-hook-form';

const AddProductModal = ({ onClose, onSave }) => {
  // Refs y estados
  const fileInputRef = useRef(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Custom hook para manejar los datos del producto
  const {
    formData,
    errors,
    previewImage,
    categories,
    isLoading,
    handleInputChange,
    handleFileChange,
    createProduct,
    cleanData,
  } = useProductData();

  // Configuración de react-hook-form
  const {
    register,
    setValue,
    trigger,
    formState: { errors: rhfErrors },
  } = useForm();

  // Sincroniza los valores de formData con react-hook-form
  useEffect(() => {
    setValue('name', formData.name);
    setValue('description', formData.description);
    setValue('price', formData.price);
    setValue('stock', formData.stock);
    setValue('idCategory', formData.idCategory);
  }, [formData, setValue]);

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = await trigger();
    if (!valid) return;

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

  // Maneja el cierre del modal
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

        {/* Animación de éxito al guardar */}
        {showSuccessAnimation && (
          <div className="success-animation-container">
            <Lottie animationData={successAnimation} loop={false} />
          </div>
        )}

        {/* Formulario principal */}
        {!showSuccessAnimation && (
          <div className="modal-body">
            <form onSubmit={handleSubmit} className="product-form" noValidate>
              {/* Campo Nombre */}
              <div className="form-group-product">
                <label htmlFor="name">Nombre del Producto*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  {...register('name', { required: 'El nombre es obligatorio' })}
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={() => trigger('name')}
                  className={rhfErrors.name ? 'error' : ''}
                  disabled={isLoading}
                />
                {rhfErrors.name && <span className="error-message">{rhfErrors.name.message}</span>}
              </div>

              {/* Campo Descripción */}
              <div className="form-group-product">
                <label htmlFor="description">Descripción*</label>
                <textarea
                  id="description"
                  name="description"
                  {...register('description', { required: 'La descripción es obligatoria' })}
                  value={formData.description}
                  onChange={handleInputChange}
                  onBlur={() => trigger('description')}
                  className={rhfErrors.description ? 'error' : ''}
                  rows="3"
                  disabled={isLoading}
                />
                {rhfErrors.description && (
                  <span className="error-message">{rhfErrors.description.message}</span>
                )}
              </div>

              {/* Fila con Precio y Stock */}
              <div className="form-row">
                {/* Campo Precio */}
                <div className="form-group-product">
                  <label htmlFor="price">Precio ($)*</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    {...register('price', {
                      required: 'El precio es obligatorio',
                      min: { value: 0.01, message: 'Debe ser mayor que 0' },
                    })}
                    value={formData.price}
                    onChange={handleInputChange}
                    onBlur={() => trigger('price')}
                    className={rhfErrors.price ? 'error' : ''}
                    min="0.01"
                    step="0.01"
                    disabled={isLoading}
                  />
                  {rhfErrors.price && <span className="error-message">{rhfErrors.price.message}</span>}
                </div>

                {/* Campo Stock */}
                <div className="form-group-product">
                  <label htmlFor="stock">Stock*</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    {...register('stock', {
                      required: 'El stock es obligatorio',
                      min: { value: 0, message: 'No puede ser negativo' },
                    })}
                    value={formData.stock}
                    onChange={handleInputChange}
                    onBlur={() => trigger('stock')}
                    className={rhfErrors.stock ? 'error' : ''}
                    min="0"
                    disabled={isLoading}
                  />
                  {rhfErrors.stock && <span className="error-message">{rhfErrors.stock.message}</span>}
                </div>
              </div>

              {/* Campo Categoría */}
              <div className="form-group-product">
                <label htmlFor="idCategory">Categoría*</label>
                <select
                  id="idCategory"
                  name="idCategory"
                  {...register('idCategory', { required: 'Seleccione una categoría' })}
                  value={formData.idCategory}
                  onChange={handleInputChange}
                  onBlur={() => trigger('idCategory')}
                  className={rhfErrors.idCategory ? 'error' : ''}
                  disabled={isLoading}
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {rhfErrors.idCategory && (
                  <span className="error-message">{rhfErrors.idCategory.message}</span>
                )}
              </div>

              {/* Campo Imagen */}
              <div className="form-group-product">
                <label htmlFor="imageUrl">Imagen del Producto*</label>
                <div className="file-upload-container">
                  <button
                    type="button"
                    className={`file-upload-btn ${rhfErrors.imageUrl ? 'error' : ''}`}
                    onClick={() => fileInputRef.current.click()}
                    disabled={isLoading}
                  >
                    <LuUpload size={18} />
                    <span>Seleccionar archivo</span>
                  </button>
                  <input
                    type="file"
                    id="imageUrl"
                    name="imageUrl"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={(e) => {
                      fileInputRef.current = e;
                      register('imageUrl', {
                        required: 'La imagen es obligatoria',
                        validate: {
                          isImage: (fileList) =>
                            fileList?.[0]?.type?.startsWith('image/') || 'El archivo debe ser una imagen',
                        },
                      }).ref(e);
                    }}
                    onChange={(e) => {
                      handleFileChange(e);
                      setValue('imageUrl', e.target.files);
                      trigger('imageUrl');
                    }}
                    disabled={isLoading}
                  />
                  {/* Vista previa de la imagen */}
                  {previewImage && (
                    <div className="image-preview">
                      <img src={previewImage} alt="Vista previa" />
                    </div>
                  )}
                  {formData.imageUrl && (
                    <div className="file-name">{formData.imageUrl.name}</div>
                  )}
                  {rhfErrors.imageUrl && (
                    <span className="error-message">{rhfErrors.imageUrl.message}</span>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
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
                  <button type="submit" className="save-btn" disabled={isLoading}>
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