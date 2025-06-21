// hooks/useReviews.js
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext'; // Ajusta la ruta según tu estructura

const API_BASE_URL = 'http://localhost:4000/api';

export const useReviews = () => {
  const { user, isLoggedIn } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las reviews
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/reviews`);
      if (!response.ok) {
        throw new Error('Error al obtener las reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener reviews filtradas por producto
  const getReviewsByProduct = (productId) => {
    return reviews.filter(review => 
      review.productId && review.productId._id === productId
    );
  };

  // Crear nueva review
  const createReview = async (reviewData) => {
    // Verificar que el usuario esté logueado
    if (!isLoggedIn || !user?.id) {
      throw new Error('Debes iniciar sesión para crear una reseña');
    }

    setLoading(true);
    setError(null);
    try {
      // Preparar los datos con el ID del usuario del contexto
      const reviewPayload = {
        ...reviewData,
        usersId: user.id // Usar el ID del usuario del contexto
      };

      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewPayload),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al crear la review');
      }

      const result = await response.json();
      
      // Actualizar la lista de reviews después de crear una nueva
      await fetchReviews();
      
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error creating review:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar review existente
  const updateReview = async (reviewId, reviewData) => {
    if (!isLoggedIn || !user?.id) {
      throw new Error('Debes iniciar sesión para actualizar una reseña');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la review');
      }

      const updatedReview = await response.json();
      
      // Actualizar la lista local de reviews
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review._id === reviewId ? updatedReview : review
        )
      );
      
      return updatedReview;
    } catch (err) {
      setError(err.message);
      console.error('Error updating review:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar review
  const deleteReview = async (reviewId) => {
    if (!isLoggedIn || !user?.id) {
      throw new Error('Debes iniciar sesión para eliminar una reseña');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la review');
      }

      // Actualizar la lista local removiendo la review eliminada
      setReviews(prevReviews => 
        prevReviews.filter(review => review._id !== reviewId)
      );
      
      return await response.json();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting review:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Calcular promedio de calificaciones para un producto
  const getAverageRating = (productId) => {
    const productReviews = getReviewsByProduct(productId);
    if (productReviews.length === 0) return 0;
    
    const sum = productReviews.reduce((acc, review) => acc + review.qualification, 0);
    return (sum / productReviews.length).toFixed(1);
  };

  // Obtener conteo de reviews por producto
  const getReviewCount = (productId) => {
    return getReviewsByProduct(productId).length;
  };

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    getReviewsByProduct,
    createReview,
    updateReview,
    deleteReview,
    getAverageRating,
    getReviewCount,
    // Exponer información del usuario y estado de autenticación
    user,
    isLoggedIn,
  };
};