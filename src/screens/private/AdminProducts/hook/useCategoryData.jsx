import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const useCategoryData = () => {
    const apiCategories = 'https://tochi-api.onrender.com/api/categories';
    // const apiCategories = 'http://localhost:4000/api/categories';

    // Estados para categorías
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Estados para el formulario
    const [formData, setFormData] = useState({
        name: ''
    });

    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);

    // Limpiar datos del formulario
    const cleanData = () => {
        setFormData({
            name: ''
        });
        setErrors({});
        setEditingId(null);
    };

    // Fetch de categorías
    const fetchCategories = async () => {
        try {
            const response = await fetch(apiCategories);
            if (!response.ok) throw new Error('Error al obtener categorías');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Error al cargar categorías');
        }
    };

    // Validación del formulario
    const validateForm = (data) => {
        const newErrors = {};

        if (!data.name || !data.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar cambios en inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error si existe
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Crear categoría - CORREGIDO: ahora recibe data como parámetro
    const createCategory = async (data) => {
        if (!validateForm(data)) {
            return false;
        }

        setIsLoading(true);
        try {
            const response = await fetch(apiCategories, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data), // Usar data en lugar de formData
            });

            const result = await response.json();
            
            if (response.ok) {
                toast.success('Categoría creada con éxito');
                cleanData();
                fetchCategories();
                return true;
            } else {
                toast.error(result.message || 'Error creando categoría');
                return false;
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            toast.error('Error al enviar la categoría');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Actualizar categoría - CORREGIDO: ahora recibe categoryId y data como parámetros
    const updateCategory = async (categoryId, data) => {
        if (!validateForm(data)) {
            return false;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${apiCategories}/${categoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data), // Usar data en lugar de formData
            });

            const result = await response.json();
            
            if (response.ok) {
                toast.success('Categoría actualizada con éxito');
                cleanData();
                fetchCategories();
                return true;
            } else {
                toast.error(result.message || 'Error actualizando categoría');
                return false;
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            toast.error('Error al actualizar la categoría');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar categoría
    const deleteCategory = async (categoryId) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiCategories}/${categoryId}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            
            if (response.ok) {
                toast.success('Categoría eliminada con éxito');
                fetchCategories();
                return true;
            } else {
                toast.error(result.message || 'Error eliminando categoría');
                return false;
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            toast.error('Error al eliminar la categoría');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar datos para edición
    const loadCategoryForEdit = (category) => {
        setFormData({
            name: category.name
        });
        setEditingId(category._id);
    };

    // Cargar datos iniciales
    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        // Estados
        categories,
        isLoading,
        formData,
        setFormData,
        errors,
        editingId,

        // Métodos
        cleanData,
        fetchCategories,
        handleInputChange,
        createCategory,
        updateCategory,
        deleteCategory,
        loadCategoryForEdit,
        validateForm
    };
};

export default useCategoryData;