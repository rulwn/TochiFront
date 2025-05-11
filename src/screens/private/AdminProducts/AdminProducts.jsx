import React, { useState } from 'react';
import { LuSearch, LuPlus, LuFilter, LuSquare, LuCheck, LuX, LuPencil, LuTrash2 } from 'react-icons/lu';
import './AdminProducts.css';
import AddProductModal from './AddProductModal'; // Importaremos este componente
import EditProductModal from './EditProductModal';

const AdminProductCard = ({
  product,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  selectionMode
}) => {
  return (
    <div
      className={`admin-product-card ${selectionMode ? 'selection-mode' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => selectionMode && onSelect(product.id)}
    >
      {isSelected && (
        <div className="selection-checkmark">
          <LuCheck size={16} />
        </div>
      )}

      <div className="admin-product-image-container">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="admin-product-image"
        />
      </div>

      <div className="admin-product-info">
        <h3 className="admin-product-name">{product.name}</h3>
        <div className="admin-product-meta">
          <span className="admin-product-price">${product.price}</span>
          <span className="admin-product-stock">
            {product.stock || 0} en stock
          </span>
        </div>
        <div className="admin-product-details">
          {product.category && (
            <span className="admin-product-category">{product.category}</span>
          )}
        </div>
      </div>

      <div className="admin-product-actions">
        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (!selectionMode) {
              onEdit(product);
            }
          }}
          aria-label="Editar producto"
          disabled={selectionMode}
        >
          <LuPencil size={18} />
        </button>
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product.id);
          }}
          aria-label="Eliminar producto"
        >
          <LuTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Producto Ejemplo 1',
      price: 19.99,
      stock: 15,
      category: 'carnes',
      imageUrl: 'https://www.dole.com/sites/default/files/styles/1024w768h-80/public/media/2025-01/dragonfruit.png?itok=ZIXGYSn5-7PakMm6A'
    },
    {
      id: 2,
      name: 'Producto Ejemplo 2',
      price: 29.99,
      stock: 8,
      category: 'verduras',
      imageUrl: 'https://www.dole.com/sites/default/files/styles/1024w768h-80/public/media/2025-01/dragonfruit.png?itok=ZIXGYSn5-7PakMm6A'
    },
    {
      id: 3,
      name: 'Producto Ejemplo 3',
      price: 9.99,
      stock: 0,
      category: 'frutas',
      imageUrl: 'https://www.dole.com/sites/default/files/styles/1024w768h-80/public/media/2025-01/dragonfruit.png?itok=ZIXGYSn5-7PakMm6A'
    },
    {
      id: 4,
      name: 'Producto Ejemplo 4',
      price: 49.99,
      stock: 22,
      category: 'lacteos',
      imageUrl: 'https://www.dole.com/sites/default/files/styles/1024w768h-80/public/media/2025-01/dragonfruit.png?itok=ZIXGYSn5-7PakMm6A'
    },
  ]);

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'lacteos', label: 'Lácteos' },
    { value: 'carnes', label: 'Carnes' },
    { value: 'frutas', label: 'Frutas' },
    { value: 'verduras', label: 'Verduras' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setSelectedProducts(prev => prev.filter(id => id !== productId));
  };

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditProduct = (product) => {
    if (!selectionMode) {
      setEditingProduct(product);
      setIsEditModalOpen(true);
    }
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedProducts([]);
    }
  };



  return (
    <div className="admin-products-container">
      <div className="admin-toolbar">
        <h1 className="admin-title">Gestión de Productos</h1>

        <div className="search-container">
          <LuSearch className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-container">
          <LuFilter className="filter-icon" size={20} />
          <select
            className="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className="add-product-btn"
          onClick={handleAddProduct}
        >
          <LuPlus size={18} />
          <span>Agregar</span>
        </button>

        <button
          className={`select-products-btn ${selectionMode ? 'active' : ''}`}
          onClick={toggleSelectionMode}
        >
          <LuSquare size={18} />
          <span>{selectionMode ? 'Cancelar' : 'Seleccionar'}</span>
        </button>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <AdminProductCard
              key={product.id}
              product={product}
              isSelected={selectedProducts.includes(product.id)}
              onSelect={toggleProductSelection}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              selectionMode={selectionMode}
            />
          ))
        ) : (
          <div className="no-products-message">
            No se encontraron productos que coincidan con los filtros.
          </div>
        )}
      </div>

      {selectionMode && selectedProducts.length > 0 && (
        <div className="selection-actions-bar">
          <div className="selected-count">
            {selectedProducts.length} seleccionados
          </div>
          <div className="selection-actions">
            <button
              className={`selection-action-btn ${selectedProducts.length !== 1 ? 'disabled' : ''}`}
              onClick={() => {
                if (selectedProducts.length === 1) {
                  const productToEdit = products.find(p => p.id === selectedProducts[0]);
                  handleEditProduct(productToEdit);
                }
              }}
              disabled={selectedProducts.length !== 1}
            >
              <LuPencil size={16} />
              <span>Editar</span>
            </button>
            <button
              className="selection-action-btn delete"
              onClick={() => {
                selectedProducts.forEach(id => handleDeleteProduct(id));
                setSelectionMode(false);
              }}
            >
              <LuTrash2 size={16} />
              <span>Eliminar</span>
            </button>
            <button
              className="selection-action-btn cancel"
              onClick={() => setSelectedProducts([])}
            >
              <LuX size={16} />
              <span>Deseleccionar</span>
            </button>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <AddProductModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={(newProduct) => {
            const newId = Math.max(...products.map(p => p.id), 0) + 1;
            const categoryLabel = categories.find(c => c.value === newProduct.idCategory)?.label || '';
            setProducts(prev => [...prev, {
              ...newProduct,
              id: newId,
              category: categoryLabel
            }]);
            setIsAddModalOpen(false);
          }}
        />
      )}
      {isEditModalOpen && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={(updatedProduct) => {
            const categoryLabel = categories.find(c => c.value === updatedProduct.idCategory)?.label || '';
            setProducts(prev => prev.map(p =>
              p.id === updatedProduct.id ? {
                ...p,
                ...updatedProduct,
                category: categoryLabel
              } : p
            ));
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default AdminProducts;