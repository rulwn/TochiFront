import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const useProductData = () => {
    const [activeTab, setActiveTab] = useState('Product');
    const apiProducto = 'https://api-rest-bl9i.onrender.com/api/products';
    const apiCategories = 'https://api-rest-bl9i.onrender.com/api/categories';

    //const apiProducto = 'http://localhost:4000/api/products';
    //const apiCategories = 'http://localhost:4000/api/categories';

    // Estados para productos
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);   

    // Estados para el formulario
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        idCategory: '',
        imageUrl: null
    });

    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState(null); 

    // Limpiar datos del formulario
    const cleanData = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            idCategory: '',
            imageUrl: null
        });
        setErrors({});
        setPreviewImage(null);
        setEditingId(null);
    };

    // Función helper para obtener el ID de categoría por nombre
    const getCategoryIdByName = (categoryName) => {
        const category = categories.find(cat => 
            cat.name?.toLowerCase() === categoryName?.toLowerCase()
        );
        return category ? category._id : categoryName;
    };

    // Función helper para obtener el nombre de categoría por ID
    const getCategoryNameById = (categoryId) => {
        const category = categories.find(cat => cat._id === categoryId);
        return category ? category.name : categoryId;
    };

    // Fetch de productos
    const fetchProducts = async () => {
        try {
            const response = await fetch(apiProducto);
            if (!response.ok) throw new Error('Error al obtener productos');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Error al cargar productos');
        }
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
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
        if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
        if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0)
            newErrors.price = 'Precio inválido';
        if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0)
            newErrors.stock = 'Stock inválido';
        if (!formData.idCategory) newErrors.idCategory = 'Seleccione una categoría';
        if (!formData.imageUrl && !editingId) newErrors.imageUrl = 'La imagen es requerida';

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
    
    // Manejar cambio de archivo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.type.match('image.*')) {
                setErrors(prev => ({ ...prev, imageUrl: 'Solo se permiten imágenes' }));
                return;
            }
            // Validar tamaño
            if (file.size > 2 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, imageUrl: 'La imagen debe ser menor a 2MB' }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                imageUrl: file
            }));

            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);

            // Limpiar error si existe
            if (errors.imageUrl) {
                setErrors(prev => ({ ...prev, imageUrl: '' }));
            }
        }
    };

    // Crear producto
    const createProduct = async () => {
        if (!validateForm()) {
            return false;
        }

        setIsLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('stock', formData.stock);
            
            const categoryId = getCategoryIdByName(formData.idCategory);
            data.append('idCategory', categoryId);
            
            if (formData.imageUrl) {
                data.append('imageUrl', formData.imageUrl);
            }

            const response = await fetch(apiProducto, {
                method: 'POST',
                body: data,
            });

            const text = await response.text();

            try {
                const result = JSON.parse(text);
                if (response.ok) {
                    toast.success('Producto creado con éxito');
                    cleanData();
                    fetchProducts();
                    return true;
                } else {
                    toast.error(result.message || 'Error creando producto');
                    return false;
                }
            } catch {
                console.error('Respuesta inesperada:', text);
                toast.error('Error inesperado del servidor');
                return false;
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            toast.error('Error al enviar el producto');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateProduct = async (productId, productData) => {
        if (!productId) {
            toast.error('ID de producto requerido');
            return false;
        }
        setIsLoading(true);
        try {
            let requestBody;
            let headers = {};

            if (productData.imageFile) {
                const data = new FormData();
                data.append('name', productData.name);
                data.append('description', productData.description);
                data.append('price', productData.price.toString());
                data.append('stock', productData.stock.toString());
                data.append('idCategory', productData.idCategory);
                data.append('imageUrl', productData.imageFile);
                
                requestBody = data;
            } else {
                // Sin imagen nueva - usar JSON
                const jsonData = {
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    stock: productData.stock,
                    idCategory: productData.idCategory
                };
                
                requestBody = JSON.stringify(jsonData);
                headers['Content-Type'] = 'application/json';
            }


            const response = await fetch(`${apiProducto}/${productId}`, {
                method: 'PUT',
                headers: headers,
                body: requestBody,
            });


            const text = await response.text();

            if (!text) {
                if (response.ok) {
                    toast.success('Producto actualizado con éxito');
                    fetchProducts();
                    return true;
                } else {
                    toast.error('Error actualizando producto - Sin respuesta del servidor');
                    return false;
                }
            }

            try {
                const result = JSON.parse(text);
                console.log('Parsed result:', result);
                
                if (response.ok) {
                    toast.success('Producto actualizado con éxito');
                    fetchProducts();
                    return true;
                } else {
                    toast.error(result.message || 'Error actualizando producto');
                    console.error('Error del servidor:', result);
                    return false;
                }
            } catch (parseError) {
                console.error('Error parseando respuesta:', parseError);
                console.error('Respuesta raw:', text);
                
                if (response.ok) {
                    toast.success('Producto actualizado con éxito');
                    fetchProducts();
                    return true;
                } else {
                    toast.error('Error inesperado del servidor');
                    return false;
                }
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            toast.error('Error al actualizar el producto: ' + error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar producto
    const deleteProduct = async (productId) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiProducto}/${productId}`, {
                method: 'DELETE',
            });

            const text = await response.text();

            try {
                const result = JSON.parse(text);
                if (response.ok) {
                    toast.success('Producto eliminado con éxito');
                    fetchProducts();
                    return true;
                } else {
                    toast.error(result.message || 'Error eliminando producto');
                    return false;
                }
            } catch {
                console.error('Respuesta inesperada:', text);
                toast.error('Error inesperado del servidor');
                return false;
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            toast.error('Error al eliminar el producto');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar datos iniciales
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    return {
        // Estados generales
        activeTab,
        setActiveTab,
        products,
        categories,
        isLoading,

        // Estados del formulario
        formData,
        errors,
        previewImage,

        // Métodos principales
        cleanData,
        fetchProducts,
        fetchCategories,
        handleInputChange,
        handleFileChange,
        createProduct,
        updateProduct,
        deleteProduct,
        validateForm,

        // Helpers para categorías
        getCategoryIdByName,
        getCategoryNameById
    };
};

export default useProductData;