import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuX, LuUpload } from 'react-icons/lu';
import Lottie from 'lottie-react';
import successAnimation from '../../../assets/success-animation.json';
import useProductData from './hook/useProductData';

const EditProductModal = ({ product, onClose, onSave }) => {
  // Custom hook para obtener categorías y manejar la actualización
  const {
    categories,
    updateProduct,
    isLoading
  } = useProductData();

  // React Hook Form para manejar los datos del formulario
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: '',
      idCategory: '',
      imageFile: null
    }
  });

  const fileInputRef = useRef(null); // Referencia para el input de archivo
  const [previewImage, setPreviewImage] = useState(null); // Imagen a mostrar como vista previa
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false); // Controla si se muestra la animación de éxito

  const imageFile = watch('imageFile'); // Observa cambios en la imagen

  // Cuando se cargan los datos del producto, se establecen los valores del formulario
  useEffect(() => {
    if (product && categories.length > 0) {
      reset({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        idCategory: product.idCategory || '',
        imageFile: null
      });
      setPreviewImage(product.imageUrl || null);
    }
  }, [product, categories, reset]);

  // Cuando el usuario selecciona una nueva imagen, se actualiza la vista previa
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else if (product?.imageUrl) {
      setPreviewImage(product.imageUrl);
    } else {
      setPreviewImage(null);
    }
  }, [imageFile, product]);

  // Al enviar el formulario se actualiza el producto
  const onSubmit = async (data) => {
    const imageFileObj = data.imageFile && data.imageFile.length > 0 ? data.imageFile[0] : null;

    const productData = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      idCategory: data.idCategory,
      imageFile: imageFileObj
    };

    const success = await updateProduct(product._id, productData);
    if (success) {
      setShowSuccessAnimation(true);
      // Espera a que termine la animación para cerrar el modal
      setTimeout(() => {
        setShowSuccessAnimation(false);
        onSave();
        onClose();
      }, 2000);
    }
  };

  // Disparar input de archivo desde botón personalizado
  const handleFileButtonClick = () => {
    if (!isLoading) {
      fileInputRef.current.click();
    }
  };

  // Cerrar modal si no está cargando o mostrando animación
  const handleClose = () => {
    if (!isLoading && !showSuccessAnimation) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Botón para cerrar modal */}
        <button
          className="modal-close-btn"
          onClick={handleClose}
          disabled={isLoading || showSuccessAnimation}
          type="button"
        >
          <LuX size={20} />
        </button>

        <h2 className="modal-title">Editar Producto</h2>

        {/* Animación de éxito */}
        {showSuccessAnimation && (
          <div className="success-animation-container">
            <Lottie animationData={successAnimation} loop={false} />
          </div>
        )}

        {/* Formulario de edición de producto */}
        {!showSuccessAnimation && (
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)} className="product-form" noValidate>
              {/* Campo: Nombre */}
              <div className="form-group-product">
                <label htmlFor="name">Nombre del Producto*</label>
                <input
                  id="name"
                  {...register('name', { required: 'El nombre es requerido' })}
                  className={errors.name ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.name && <span className="error-message">{errors.name.message}</span>}
              </div>

              {/* Campo: Descripción */}
              <div className="form-group-product">
                <label htmlFor="description">Descripción*</label>
                <textarea
                  id="description"
                  rows="3"
                  {...register('description', { required: 'La descripción es requerida' })}
                  className={errors.description ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.description && <span className="error-message">{errors.description.message}</span>}
              </div>

              {/* Campos: Precio y Stock */}
              <div className="form-row">
                <div className="form-group-product">
                  <label htmlFor="price">Precio ($)*</label>
                  <input
                    id="price"
                    type="number"
                    min="0.01"
                    {...register('price', {
                      required: 'El precio es requerido',
                    })}
                    className={errors.price ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors.price && <span className="error-message">{errors.price.message}</span>}
                </div>

                <div className="form-group-product">
                  <label htmlFor="stock">Stock*</label>
                  <input
                    id="stock"
                    type="number"
                    min="0"
                    {...register('stock', {
                      required: 'El stock es requerido',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Stock no puede ser negativo' }
                    })}
                    className={errors.stock ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors.stock && <span className="error-message">{errors.stock.message}</span>}
                </div>
              </div>

              {/* Campo: Categoría */}
              <div className="form-group-product">
                <label htmlFor="idCategory">Categoría*</label>
                <select
                  id="idCategory"
                  {...register('idCategory', { required: 'Seleccione una categoría' })}
                  className={errors.idCategory ? 'error' : ''}
                  disabled={isLoading}
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.idCategory && <span className="error-message">{errors.idCategory.message}</span>}
              </div>

              {/* Campo: Imagen del producto */}
              <div className="form-group">
                <label htmlFor="imageFile">Imagen del Producto</label>
                <div className="file-upload-container">
                  {/* Botón personalizado para seleccionar archivo */}
                  <button
                    type="button"
                    className={`file-upload-btn ${errors.imageFile ? 'error' : ''}`}
                    onClick={handleFileButtonClick}
                    disabled={isLoading}
                  >
                    <LuUpload size={18} />
                    <span>Cambiar imagen</span>
                  </button>
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    style={{ display: 'none' }}
                    {...register('imageFile', {
                      validate: {
                        isImage: files => {
                          if (!files || files.length === 0) return true;
                          const file = files[0];
                          return file.type.startsWith('image/') || 'Solo se permiten imágenes';
                        },
                        maxSize: files => {
                          if (!files || files.length === 0) return true;
                          const file = files[0];
                          return file.size <= 2 * 1024 * 1024 || 'La imagen debe ser menor a 2MB';
                        }
                      }
                    })}
                    ref={e => {
                      register('imageFile').ref(e);
                      fileInputRef.current = e;
                    }}
                  />
                  {/* Vista previa de la imagen */}
                  {previewImage && (
                    <div className="image-preview">
                      <img src={previewImage} alt="Vista previa" />
                    </div>
                  )}
                  {/* Nombre del archivo seleccionado */}
                  {imageFile && imageFile.length > 0 && (
                    <div className="file-name">{imageFile[0].name}</div>
                  )}
                  {errors.imageFile && <span className="error-message">{errors.imageFile.message}</span>}
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
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Actualizando...' : 'Actualizar Producto'}
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

export default EditProductModal;
