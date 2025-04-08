import React from 'react';
import './CategoriesCard.css';

const colorSequence = [
  'rgba(248, 164, 76, 0.15)',  // F8A44C
  'rgba(83, 177, 117, 0.15)',   // 53B175
  'rgba(108, 76, 248, 0.15)',   // 6C4CF8
  'rgba(222, 2, 2, 0.15)'       // DE0202
];

function CategoriesCard({ categoryName, imageUrl, index = 0 }) {
  // Selecciona el color basado en el índice (usa módulo para ciclar)
  const bgColor = colorSequence[index % colorSequence.length];

  return (
    <div 
      className="categories-card"
      style={{ backgroundColor: bgColor }}
    >
      <div className="category-image-container">
        <img 
          src={imageUrl || 'https://via.placeholder.com/80x80?text=Category'} 
          alt={categoryName} 
          className="category-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/80x80?text=Category';
          }}
        />
      </div>
      <div className="category-name">
        {categoryName}
      </div>
    </div>
  );
}

export default CategoriesCard;
