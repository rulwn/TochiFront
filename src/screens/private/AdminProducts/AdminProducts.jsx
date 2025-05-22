import React, { useState } from 'react';
import { LuSearch, LuPlus, LuFilter, LuSquare, LuCheck, LuX, LuPencil, LuTrash2 } from 'react-icons/lu';
import toast from 'react-hot-toast';
import './AdminProducts.css';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import useProductData from './hook/useProductData';

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
      onClick={() => selectionMode && onSelect(product._id)}
    >
      {isSelected && (
        <div className="selection-checkmark">
          <LuCheck size={16} />
        </div>
      )}

      <div className="admin-product-image-container">
        <img
          src={product.imageUrl || product.imgUrl}
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
            onDelete(product._id);
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
  const { products, setProducts, fetchProducts } = useProductData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'lacteos', label: 'Lácteos' },
    { value: 'carnes', label: 'Carnes' },
    { value: 'frutas', label: 'Frutas' },
    { value: 'verduras', label: 'Verduras' }
  ];

  const filteredProducts = products.filter(product => {
const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesCategory = selectedCategory === 'all' || product.idCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }

      setProducts(prev => prev.filter(p => p._id !== productId));
      setSelectedProducts(prev => prev.filter(id => id !== productId));
      fetchProducts();

      toast.success('Producto eliminado con éxito');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar el producto');
    }
  };

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedProducts([]);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const deletePromises = selectedProducts.map(id =>
        fetch(`http://localhost:4000/api/products/${id}`, {
          method: 'DELETE',
        })
      );

      await Promise.all(deletePromises);

      setProducts(prev => prev.filter(p => !selectedProducts.includes(p._id)));
      setSelectedProducts([]);
      setSelectionMode(false);
      fetchProducts();

      toast.success('Productos eliminados con éxito');
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Error al eliminar los productos');
    }
  };

  return (
    <div className="admin-products-container">
      <div className="admin-toolbar1">
        <h1 className="admin-title1">Gestión de Productos</h1>

        <div className="search-container-products">
          <LuSearch className="search-icon-products" size={20} />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="search-input-products"
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
            {categories.map((category) => (
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
          filteredProducts.map((product, index) => (
            <AdminProductCard
              key={product._id || `product-${index}`}
              product={product}
              isSelected={selectedProducts.includes(product._id)}
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
                  const productToEdit = products.find(p => p._id === selectedProducts[0]);
                  setEditingProduct(productToEdit);
                  setIsEditModalOpen(true);
                }
              }}
              disabled={selectedProducts.length !== 1}
            >
              <LuPencil size={16} />
              <span>Editar</span>
            </button>
            <button
              className="selection-action-btn delete"
              onClick={handleBulkDelete}
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
            setIsAddModalOpen(false);
            fetchProducts();
          }}
        />
      )}

      {isEditModalOpen && editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={(updatedProduct) => {
            setProducts(prev => prev.map(p => (p._id === updatedProduct._id ? updatedProduct : p)));
            setIsEditModalOpen(false);
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}

export default AdminProducts;
