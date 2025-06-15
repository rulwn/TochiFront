import { useState, useEffect } from 'react';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usar la misma URL base que en tu hook de categorías
  const API_BASE_URL = 'https://api-rest-bl9i.onrender.com/api';
  // const API_BASE_URL = 'http://localhost:4000/api';

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/products`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Mapear los datos del backend al formato que espera tu frontend
      const mappedProducts = data.map(product => ({
        id: product._id, // MongoDB usa _id
        name: product.name,
        description: product.description,
        categoryId: product.idCategory, // Mantener el ID de categoría para filtrar
        category: product.idCategory, // También como category para compatibilidad
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl || 'https://i.imgur.com/6FpegJL.png', // Imagen por defecto
        quantity: '', // Si no tienes este campo en el backend, puedes dejarlo vacío
        unit: 'Price' // Si no tienes este campo en el backend, valor por defecto
      }));
      
      setProducts(mappedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Función para refrescar los productos manualmente
  const refreshProducts = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    refreshProducts
  };
};

export default useProducts;