import React, { useState } from 'react';
import { LuX } from 'react-icons/lu';

const AddCategoryModal = ({ onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState(initialName);
  const [error, setError] = useState('');
  

  const validateForm = () => {
    if (!categoryName.trim()) {
      setError('El nombre de la categoría es requerido');
      return false;
    }
    if (categoryName.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        name: categoryName.trim()
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          <LuX size={20} />
        </button>
        
        <h2 className="modal-title">Agregar Nueva Categoría</h2>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="category-form" noValidate>
            <div className="form-group">
              <label htmlFor="categoryName">Nombre de la Categoría*</label>
              <input
                type="text"
                id="categoryName"
                name="categoryName"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  if (error) setError('');
                }}
                className={error ? 'error' : ''}
                required
                autoFocus
              />
              {error && <span className="error-message">{error}</span>}
            </div>
          </form>
        </div>
        
        <div className="modal-footer">
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save-btn" onClick={handleSubmit}>
              Guardar Categoría
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;