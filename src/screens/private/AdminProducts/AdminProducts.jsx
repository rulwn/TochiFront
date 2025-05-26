import React, { useState } from 'react';
import { LuSearch, LuPlus, LuFilter, LuSquare, LuCheck, LuX, LuPencil, LuTrash2, LuFolder, LuBox } from 'react-icons/lu';
import toast from 'react-hot-toast';
import './AdminProducts.css';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import AddCategoryModal from './AddCategoryModal';
import useProductData from './hook/useProductData';

// Componente de tarjeta de producto
const AdminProductCard = ({ product, isSelected, onSelect, onEdit, onDelete, selectionMode }) => {
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

// Componente de tarjeta de categoría
const AdminCategoryCard = ({ category, isSelected, onSelect, onEdit, onDelete, selectionMode }) => {
  return (
    <div
      className={`admin-category-card ${selectionMode ? 'selection-mode' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => selectionMode && onSelect(category.id)}
    >
      {isSelected && (
        <div className="selection-checkmark">
          <LuCheck size={16} />
        </div>
      )}

      <div className="admin-category-icon-container">
        <LuFolder size={40} className="admin-category-icon" />
      </div>

      <div className="admin-category-info">
        <h3 className="admin-category-name">{category.name}</h3>
        <div className="admin-category-meta">
          <span className="admin-category-products">
            {category.productCount} productos
          </span>
        </div>
      </div>

      <div className="admin-category-actions">
        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (!selectionMode) {
              onEdit(category);
            }
          }}
          aria-label="Editar categoría"
          disabled={selectionMode}
        >
          <LuPencil size={18} />
        </button>
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(category.id);
          }}
          aria-label="Eliminar categoría"
        >
          <LuTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

function AdminProducts() {
  const [activeTab, setActiveTab] = useState('products');
  const { 
    products, 
    fetchProducts, 
    deleteProduct 
  } = useProductData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);

  const [categoriesData, setCategoriesData] = useState([
    { id: 1, name: 'Lácteos', value: 'lacteos', productCount: 1 },
    { id: 2, name: 'Carnes', value: 'carnes', productCount: 1 },
    { id: 3, name: 'Frutas', value: 'frutas', productCount: 1 },
    { id: 4, name: 'Verduras', value: 'verduras', productCount: 1 }
  ]);

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    ...categoriesData.map(cat => ({ value: cat.value, label: cat.name }))
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesCategory = selectedCategory === 'all' || product.idCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredCategories = categoriesData.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleCategorySelection = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (!confirmDelete) return;

    try {
      const success = await deleteProduct(productId);
      
      if (success) {
        setSelectedProducts(prev => prev.filter(id => id !== productId));
        toast.success('Producto eliminado con éxito');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar el producto');
    }
  };

  const handleDeleteCategory = (categoryId) => {
    const categoryToDelete = categoriesData.find(c => c.id === categoryId);
    if (categoryToDelete) {
      setCategoriesData(prev => prev.filter(c => c.id !== categoryId));
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
      // Opcional: actualizar productos que pertenezcan a esta categoría
    }
  };

  const handleAddProduct = () => {
    setIsAddProductModalOpen(true);
  };

  const handleAddCategory = (newCategory) => {
    const newId = Math.max(...categoriesData.map(c => c.id), 0) + 1;
    const newCategoryData = {
      id: newId,
      name: newCategory.name,
      value: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
      productCount: 0
    };

    setCategoriesData(prev => [...prev, newCategoryData]);
    setIsAddCategoryModalOpen(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditProductModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsEditCategoryModalOpen(true);
  };

  const handleAdd = () => {
    if (activeTab === 'products') {
      handleAddProduct();
    } else {
      setIsAddCategoryModalOpen(true);
    }
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      if (activeTab === 'products') {
        setSelectedProducts([]);
      } else {
        setSelectedCategories([]);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (activeTab === 'products') {
      const confirmDelete = window.confirm(
        `¿Estás seguro de que deseas eliminar ${selectedProducts.length} producto(s)?`
      );
      if (!confirmDelete) return;

      try {
        const deletePromises = selectedProducts.map(id => deleteProduct(id));
        await Promise.all(deletePromises);

        setSelectedProducts([]);
        setSelectionMode(false);
        
        toast.success('Productos eliminados con éxito');
      } catch (error) {
        console.error('Error deleting products:', error);
        toast.error('Error al eliminar los productos');
      }
    } else {
      // Lógica para eliminar categorías en masa
      selectedCategories.forEach(id => handleDeleteCategory(id));
      setSelectedCategories([]);
      setSelectionMode(false);
    }
  };

  return (
    <div className="admin-products-container">
      {/* Barra de pestañas */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <LuBox size={18} />
          <span>Productos</span>
        </button>
        <button
          className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <LuFolder size={18} />
          <span>Categorías</span>
        </button>
      </div>

      {/* Barra de herramientas */}
      <div className="admin-toolbar1">
        <h1 className="admin-title1">
          {activeTab === 'products' ? 'Gestión de Productos' : 'Gestión de Categorías'}
        </h1>

        <div className="search-container-products">
          <LuSearch className="search-icon-products" size={20} />
          <input
            type="text"
            placeholder={activeTab === 'products' ? 'Buscar productos...' : 'Buscar categorías...'}
            className="search-input-products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {activeTab === 'products' && (
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
        )}

        <button
          className="add-product-btn"
          onClick={handleAdd}
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
        {activeTab === 'products' ? (
          filteredProducts.length > 0 ? (
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
          )
        ) : (
          filteredCategories.length > 0 ? (
            filteredCategories.map(category => (
              <AdminCategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategories.includes(category.id)}
                onSelect={toggleCategorySelection}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                selectionMode={selectionMode}
              />
            ))
          ) : (
            <div className="no-products-message">
              No se encontraron categorías que coincidan con los filtros.
            </div>
          )
        )}
      </div>

      {selectionMode && (
        (activeTab === 'products' && selectedProducts.length > 0) || 
        (activeTab === 'categories' && selectedCategories.length > 0)
      ) && (
        <div className="selection-actions-bar">
          <div className="selected-count">
            {activeTab === 'products' 
              ? `${selectedProducts.length} productos seleccionados` 
              : `${selectedCategories.length} categorías seleccionadas`}
          </div>
          <div className="selection-actions">
            <button
              className={`selection-action-btn ${
                (activeTab === 'products' && selectedProducts.length !== 1) ||
                (activeTab === 'categories' && selectedCategories.length !== 1) 
                  ? 'disabled' : ''
              }`}
              onClick={() => {
                if (activeTab === 'products' && selectedProducts.length === 1) {
                  const productToEdit = products.find(p => p._id === selectedProducts[0]);
                  handleEditProduct(productToEdit);
                } else if (activeTab === 'categories' && selectedCategories.length === 1) {
                  const categoryToEdit = categoriesData.find(c => c.id === selectedCategories[0]);
                  handleEditCategory(categoryToEdit);
                }
              }}
              disabled={
                (activeTab === 'products' && selectedProducts.length !== 1) ||
                (activeTab === 'categories' && selectedCategories.length !== 1)
              }
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
              onClick={() => {
                if (activeTab === 'products') {
                  setSelectedProducts([]);
                } else {
                  setSelectedCategories([]);
                }
              }}
            >
              <LuX size={16} />
              <span>Deseleccionar</span>
            </button>
          </div>
        </div>
      )}

      {isAddProductModalOpen && (
        <AddProductModal
          onClose={() => setIsAddProductModalOpen(false)}
          onSave={() => {
            setIsAddProductModalOpen(false);
            fetchProducts();
          }}
        />
      )}

      {isEditProductModalOpen && editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => {
            setIsEditProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            setIsEditProductModalOpen(false);
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}

      {isAddCategoryModalOpen && (
        <AddCategoryModal
          onClose={() => setIsAddCategoryModalOpen(false)}
          onSave={handleAddCategory}
        />
      )}

      {isEditCategoryModalOpen && editingCategory && (
        <EditProductModal
          product={editingCategory}
          onClose={() => {
            setIsEditCategoryModalOpen(false);
            setEditingCategory(null);
          }}
          onSave={(updatedCategory) => {
            setCategoriesData(prev => prev.map(c =>
              c.id === updatedCategory.id ? updatedCategory : c
            ));
            setIsEditCategoryModalOpen(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}

export default AdminProducts;