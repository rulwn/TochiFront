import React, { useState, useEffect } from 'react';
import { LuX } from 'react-icons/lu';
import Lottie from 'lottie-react';
import successAnimation from '../../../assets/success-animation.json';
import { useForm } from 'react-hook-form';

const AddEditCategoryModal = ({ 
    isOpen, 
    onClose, 
    onSave, 
    formData,
    editingId,
    createCategory,
    updateCategory,
    isLoading
}) => {
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: ''
        }
    });

    // Sincronizar formData con react-hook-form cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            if (editingId && formData.name) {
                // Modo editar: cargar datos existentes
                setValue('name', formData.name);
            } else {
                // Modo agregar: limpiar formulario
                reset({ name: '' });
            }
        }
    }, [isOpen, editingId, formData.name, setValue, reset]);

    const onSubmit = async (data) => {
        try {
            let success = false;
            
            if (editingId) {
                // Modo editar: pasar el ID y los datos
                success = await updateCategory(editingId, data);
            } else {
                // Modo agregar: solo pasar los datos
                success = await createCategory(data);
            }

            if (success) {
                setShowSuccessAnimation(true);
                setTimeout(() => {
                    setShowSuccessAnimation(false);
                    onSave?.(); // Llamar callback para actualizar la lista
                    onClose(); // Cerrar modal
                }, 2000);
            }
        } catch (error) {
            console.error('Error in form submission:', error);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            reset(); // Limpiar el formulario al cerrar
            onClose();
        }
    };

    // Manejar ESC para cerrar modal
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !isLoading) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, isLoading]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget && !isLoading) {
                handleClose();
            }
        }}>
            <div className="modal-content">
                <button 
                    className="modal-close-btn" 
                    onClick={handleClose}
                    disabled={isLoading}
                >
                    <LuX size={20} />
                </button>

                <h2 className="modal-title">
                    {editingId ? 'Editar Categoría' : 'Agregar Nueva Categoría'}
                </h2>

                {showSuccessAnimation && (
                    <div className="success-animation-container">
                        <Lottie animationData={successAnimation} loop={false} />
                        <p>¡Categoría {editingId ? 'actualizada' : 'creada'} con éxito!</p>
                    </div>
                )}

                {!showSuccessAnimation && (
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(onSubmit)} className="category-form" noValidate>
                            <div className="form-group">
                                <label htmlFor="name">Nombre de la Categoría*</label>
                                <input
                                    type="text"
                                    id="name"
                                    {...register('name', { 
                                        required: 'El nombre es obligatorio',
                                        minLength: {
                                            value: 2,
                                            message: 'El nombre debe tener al menos 2 caracteres'
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: 'El nombre no puede exceder 50 caracteres'
                                        },
                                        pattern: {
                                            value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
                                            message: 'El nombre solo puede contener letras y espacios'
                                        }
                                    })}
                                    className={errors.name ? 'error' : ''}
                                    disabled={isLoading}
                                    placeholder="Ingresa el nombre de la categoría"
                                />
                                {errors.name && (
                                    <span className="error-message">{errors.name.message}</span>
                                )}
                            </div>

                            <div className="modal-footer">
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={handleClose}
                                        disabled={isLoading}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="save-btn" 
                                        disabled={isLoading}
                                    >
                                        {isLoading 
                                            ? (editingId ? 'Actualizando...' : 'Guardando...') 
                                            : (editingId ? 'Actualizar Categoría' : 'Guardar Categoría')
                                        }
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddEditCategoryModal;