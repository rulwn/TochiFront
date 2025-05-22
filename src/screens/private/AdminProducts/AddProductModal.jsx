import React, { useState, useRef, useEffect } from 'react';
import { LuX, LuUpload } from 'react-icons/lu';

const AddProductModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    idCategory: '',
    imageUrl: null
  });

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
      })
      .catch(err => {
        console.error('Error cargando categorías:', err);
      });
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0)
      newErrors.price = 'Precio inválido';
    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0)
      newErrors.stock = 'Stock inválido';
    if (!formData.idCategory) newErrors.idCategory = 'Seleccione una categoría';
    if (!formData.imageUrl) newErrors.imageUrl = 'La imagen es requerida';

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
        setErrors(prev => ({ ...prev, imageUrl: 'Solo se permiten imágenes' }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imageUrl: 'La imagen debe ser menor a 2MB' }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        imageUrl: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      if (errors.imageUrl) {
        setErrors(prev => ({ ...prev, imageUrl: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('idCategory', formData.idCategory);
        if (formData.imageUrl) {
          data.append('imageUrl', formData.imageUrl);
        }

        const res = await fetch('http://localhost:4000/api/products', {
          method: 'POST',
          body: data,
        });

        const text = await res.text();

        try {
          const result = JSON.parse(text);
          if (res.ok) {
            alert('Producto creado con éxito');
            onSave();
            onClose();
          } else {
            alert(result.message || 'Error creando producto');
          }
        } catch {
          console.error('Respuesta inesperada:', text);
          alert('Error inesperado del servidor');
        }
      }
      catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error al enviar el producto');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          <LuX size={20} />
        </button>

        <h2 className="modal-title">Agregar Nuevo Producto</h2>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="product-form" noValidate>
            <div className="form-group-product">
              <label htmlFor="name">Nombre del Producto*</label>
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

            <div className="form-group-product">
              <label htmlFor="description">Descripción*</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'error' : ''}
                required
                rows="3"
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
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  className={errors.price ? 'error' : ''}
                  required
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
                  onChange={handleChange}
                  min="0"
                  className={errors.stock ? 'error' : ''}
                  required
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
                onChange={handleChange}
                className={errors.idCategory ? 'error' : ''}
                required
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
                <button type="button" className="cancel-btn" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="save-btn">
                  Guardar Producto
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
