import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuX, LuUpload } from 'react-icons/lu';
import useProductData from './hook/useProductData';

const EditProductModal = ({ product, onClose, onSave }) => {
  const {
    categories,
    updateProduct,
    isLoading
  } = useProductData();

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

  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Watch imageFile to update preview
  const imageFile = watch('imageFile');

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

  const onSubmit = async (data) => {
    // data.imageFile is a FileList, convert to single file or null
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
      onSave();
    }
  };

  const handleFileButtonClick = () => {
    if (!isLoading) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button
          className="modal-close-btn"
          onClick={onClose}
          disabled={isLoading}
          type="button"
        >
          <LuX size={20} />
        </button>

        <h2 className="modal-title">Editar Producto</h2>
        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)} className="product-form" noValidate>
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

            <div className="form-row">
              <div className="form-group-product">
                <label htmlFor="price">Precio ($)*</label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register('price', {
                    required: 'El precio es requerido',
                    valueAsNumber: true,
                    min: { value: 0.01, message: 'Precio debe ser mayor que 0' }
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
                    min: { value: 0, message: 'Stock no puede ser negativo' },
                    validate: value => Number.isInteger(value) || 'Stock debe ser un número entero'
                  })}
                  className={errors.stock ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.stock && <span className="error-message">{errors.stock.message}</span>}
              </div>
            </div>

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

            <div className="form-group">
              <label htmlFor="imageFile">Imagen del Producto</label>
              <div className="file-upload-container">
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
                        if (!files || files.length === 0) return true; // optional
                        const file = files[0];
                        return file.type.startsWith('image/') || 'Solo se permiten imágenes';
                      },
                      maxSize: files => {
                        if (!files || files.length === 0) return true; // optional
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
                {previewImage && (
                  <div className="image-preview">
                    <img src={previewImage} alt="Vista previa" />
                  </div>
                )}
                {imageFile && imageFile.length > 0 && (
                  <div className="file-name">{imageFile[0].name}</div>
                )}
                {errors.imageFile && <span className="error-message">{errors.imageFile.message}</span>}
              </div>
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
                  disabled={isLoading}
                >
                  {isLoading ? 'Actualizando...' : 'Actualizar Producto'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
