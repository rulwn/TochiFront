import React from 'react';
import { FiChevronDown } from "react-icons/fi";
import './Combobox.css';

function Combobox({ onCategoryChange }) {
  const handleChange = (e) => {
    onCategoryChange(e.target.value);
  };

  return (
    <div className="combobox-container">
      <div className="combobox">
        <select className="combobox-select" onChange={handleChange}>
          <option value="todos">Todas las categorías</option>
          <option value="lacteos">Lácteos</option>
          <option value="carnes">Carnes</option>
          <option value="frutas">Frutas</option>
          <option value="verduras">Verduras</option>
          <option value="panaderia">Panadería</option>
        </select>
        <FiChevronDown className="combobox-icon" size={20} />
      </div>
    </div>
  );
}

export default Combobox;