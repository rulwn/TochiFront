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
    // Estado para mostrar la animación de éxito
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

    // Hook de formulario con validación
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: ''
        }
    });

    // Efecto para cargar los datos del formulario si se va a editar una categoría
    useEffect(() => {
        if (isOpen) {
            if (editingId && formData.name) {
                setValue('name', formData.name); // Cargar nombre en modo edición
            } else {
                reset({ name: '' }); // Limpiar el campo en modo creación
            }
        }
    }, [isOpen, editingId, formData.name, setValue, reset]);

    // Función que se ejecuta al enviar el formulario
    const onSubmit = async (data) => {
        try {
            let success = false;

            if (editingId) {
                success = await updateCategory(editingId, data); // Actualizar categoría existente
            } else {
                success = await createCategory(data); // Crear nueva categoría
            }

            // Si la operación fue exitosa, mostrar animación de éxito
            if (success) {
                setShowSuccessAnimation(true);
                setTimeout(() => {
                    setShowSuccessAnimation(false);
                    onSave?.();  // Llama a onSave si está definido
                    onClose();   // Cierra el modal
                }, 2000); // Espera 2 segundos para que se vea la animación
            }
        } catch (error) {
            console.error('Error in form submission:', error);
        }
    };

    // Función para cerrar el modal (y resetear formulario)
    const handleClose = () => {
        if (!isLoading) {
            reset();     // Limpia el formulario
            onClose();   // Cierra el modal
        }
    };

    // Efecto que cierra el modal si se presiona la tecla Escape
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

    // Si el modal no está abierto, no renderizar nada
    if (!isOpen) return null;

    return (
        <div
            className="modal-overlay"
            onClick={(e) => {
                // Cierra el modal si se hace clic fuera del contenido
                if (e.target === e.currentTarget && !isLoading) {
                    handleClose();
                }
            }}
        >
            <div className="modal-content">
                {/* Botón para cerrar el modal */}
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

                {/* Animación de éxito */}
                {showSuccessAnimation && (
                    <div className="success-animation-container">
                        <Lottie animationData={successAnimation} loop={false} />
                        <p>¡Categoría {editingId ? 'actualizada' : 'creada'} con éxito!</p>
                    </div>
                )}

                {/* Formulario solo se muestra si no hay animación de éxito */}
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
                                {/* Mostrar mensaje de error si lo hay */}
                                {errors.name && (
                                    <span className="error-message">{errors.name.message}</span>
                                )}
                            </div>

                            <div className="modal-footer">
                                <div className="form-actions">
                                    {/* Botón de cancelar */}
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={handleClose}
                                        disabled={isLoading}
                                    >
                                        Cancelar
                                    </button>
                                    {/* Botón de guardar/actualizar */}
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
