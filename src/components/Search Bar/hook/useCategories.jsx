import { useState, useEffect } from 'react';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usar la misma URL que tienes en tu hook de categorías
  const apiCategories = 'https://api-rest-bl9i.onrender.com/api/categories';
  // const apiCategories = 'http://localhost:4000/api/categories';

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(apiCategories);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Mapear las categorías para el formato que necesita el combobox
      const mappedCategories = data.map(category => ({
        id: category._id,
        name: category.name,
        value: category._id // Usar el ID como value para filtrar
      }));
      
      setCategories(mappedCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Función para refrescar las categorías manualmente
  const refreshCategories = () => {
    fetchCategories();
  };

  return {
    categories,
    loading,
    error,
    refreshCategories
  };
};

export default useCategories;