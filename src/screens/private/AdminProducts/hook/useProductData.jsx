import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const useProductData = () => {

    const [activeTab, setActiveTab] = useState('Product');

    const apiProducto = 'http://localhost:4000/api/products';

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [idCategory, setIdCategory] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [products, setProducts] = useState([]);


    const cleanData = () => {
        setId('');
        setName('');
        setDescription('');
        setPrice('');
        setStock('');
        setIdCategory('');
        setImgUrl('');
    }

    const fetchProducts = async () => {
        try {
            const response = await fetch(apiProducto);
            if (!response.ok) throw new Error('Error al obtener productos');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('stock', stock);
            formData.append('idCategory', idCategory);
            formData.append('imageUrl', imgUrl); 

            const response = await fetch(apiProducto, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al crear el producto');
            }

            toast.success('Producto creado con éxito');
            cleanData();
            fetchProducts(); // Corrige el typo que tenías antes

        } catch (error) {
            console.error('Error creating product:', error);
            toast.error('Error al crear el producto');
        }
    };

    


    return {
        activeTab,
        setActiveTab,
        id,
        setId,
        name,
        setName,
        description,
        setDescription,
        price,
        setPrice,
        stock,
        setStock,
        idCategory,
        setIdCategory,
        imgUrl,
        setImgUrl,
        products,
        setProducts,
        cleanData,
        handleSubmit,
        fetchProducts
    }
}

export default useProductData;