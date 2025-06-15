import React from 'react';
import { FiChevronDown } from "react-icons/fi";
import './Combobox.css';
import useCategories from './hook/useCategories'; // Ajusta la ruta según tu estructura

function Combobox({ onCategoryChange }) {
  const { categories, loading, error } = useCategories();

  const handleChange = (e) => {
    onCategoryChange(e.target.value);
  };

  if (loading) {
    return (
      <div className="combobox-container">
        <div className="combobox">
          <select className="combobox-select" disabled>
            <option>Cargando categorías...</option>
          </select>
          <FiChevronDown className="combobox-icon" size={20} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="combobox-container">
        <div className="combobox">
          <select className="combobox-select" onChange={handleChange}>
            <option value="todos">Todas las categorías</option>
          </select>
          <FiChevronDown className="combobox-icon" size={20} />
        </div>
      </div>
    );
  }

  return (
    <div className="combobox-container">
      <div className="combobox">
        <select className="combobox-select" onChange={handleChange}>
          <option value="todos">Todas las categorías</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <FiChevronDown className="combobox-icon" size={20} />
      </div>
    </div>
  );
}

export default Combobox;