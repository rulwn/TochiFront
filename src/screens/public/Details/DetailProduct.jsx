// Import necessary React hooks and components
import React, { useState, useEffect } from 'react';
// Import icons from react-icons library
import { LuShoppingCart, LuX, LuPlus, LuMinus, LuArrowLeft, LuStar, LuRefreshCw } from 'react-icons/lu';
// Import routing utilities from react-router-dom
import { useLocation, useNavigate } from 'react-router-dom';
// Import CSS styles for this component
import './DetailProduct.css';
// Import custom hook for reviews
import { useReviews } from './hooks/useReviews';
// Import authentication context to check user login status
import { useAuth } from '../../../context/AuthContext';

// Main DetailProduct component that receives onAddToCart function as prop
function DetailProduct({ onAddToCart }) {
    // React Router hooks to access current location and navigation
    const location = useLocation();
    const navigate = useNavigate();
    // Get product data passed via route state
    const product = location.state?.product;

    // Auth context to check if user is logged in
    const { user: authUser, isLoggedIn: authIsLoggedIn } = useAuth();

    // Custom hook for reviews management
    const {
        reviews,
        loading: reviewsLoading,
        error: reviewsError,
        fetchReviews,
        getReviewsByProduct,
        createReview,
        getAverageRating,
        getReviewCount,
        user,
        isLoggedIn
    } = useReviews();

    // State management for various component features:
    
    // Controls visibility of quantity selection dialog
    const [showDialog, setShowDialog] = useState(false);
    // Tracks selected product quantity (defaults to 1)
    const [quantity, setQuantity] = useState(1);
    // Manages form state for product reviews
    const [review, setReview] = useState({
        qualification: 0,
        comments: ''
    });
    // Loading state for review submission
    const [submittingReview, setSubmittingReview] = useState(false);
    // Success message state
    const [reviewSuccess, setReviewSuccess] = useState('');

    // Load reviews when component mounts
    useEffect(() => {
        fetchReviews();
    }, []);

    // Redirect to home if no product data is available
    if (!product) {
        navigate('/');
        return null;
    }

    // Get reviews for current product
    const productReviews = getReviewsByProduct(product._id || product.id);
    const averageRating = getAverageRating(product._id || product.id);
    const reviewCount = getReviewCount(product._id || product.id);

    // Handles adding product to cart with confirmation
    const handleAddToCart = (confirmed) => {
        if (confirmed) {
            // Call parent component's add to cart function with product and quantity
            onAddToCart({ ...product, selectedQuantity: quantity }, true);
            // Close dialog and reset quantity
            setShowDialog(false);
            setQuantity(1);
        }
    };

    // Handles changes in review form inputs
    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        // Update review state while preserving other properties
        setReview(prev => ({ ...prev, [name]: value }));
    };

    // Updates star rating in review form
    const handleRatingChange = (newRating) => {
        setReview(prev => ({ ...prev, qualification: newRating }));
    };

    // Handles review form submission
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (review.qualification === 0 || !review.comments.trim()) {
            alert('Por favor, completa todos los campos de la reseña.');
            return;
        }

        setSubmittingReview(true);
        setReviewSuccess('');

        try {
            // Prepare review data for API (el hook ya maneja la validación de usuario)
            const reviewData = {
                productId: product._id || product.id,
                qualification: review.qualification,
                comments: review.comments.trim()
            };

            await createReview(reviewData);
            
            // Reset form and show success message
            setReview({ qualification: 0, comments: '' });
            setReviewSuccess('¡Reseña enviada exitosamente!');
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setReviewSuccess('');
            }, 3000);

        } catch (error) {
            console.error('Error submitting review:', error);
            alert(error.message || 'Error al enviar la reseña. Por favor, inténtalo de nuevo.');
        } finally {
            setSubmittingReview(false);
        }
    };

    // Increases product quantity (max 50)
    const incrementQuantity = () => {
        if (quantity < 50) setQuantity(prev => prev + 1);
    };

    // Decreases product quantity (min 1)
    const decrementQuantity = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Render star rating
    const renderStars = (rating, interactive = false, onStarClick = null) => {
        return [...Array(5)].map((_, i) => (
            <span
                key={i}
                className={`star ${i < rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
                onClick={interactive ? () => onStarClick?.(i + 1) : undefined}
                style={{ cursor: interactive ? 'pointer' : 'default' }}
            >
                ★
            </span>
        ));
    };

    // Component render
    return (
        <div className="detail-page">
            {/* Back button to return to previous page */}
            <button
                onClick={() => navigate(-1)}
                className="detail-back-button"
            >
                <LuArrowLeft className="back-icon" />
                Back
            </button>

            {/* Main product container with image and info sections */}
            <div className="detail-product-container">
                {/* Product image section */}
                <div className="detail-product-image-container">
                    <img
                        src={product.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={product.name}
                        className="detail-product-image"
                        // Fallback to placeholder if image fails to load
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                    />
                </div>

                {/* Product information section */}
                <div className="detail-product-info">
                    {/* Product name */}
                    <h2 className="detail-product-name">{product.name}</h2>
                    
                    {/* Product rating summary */}
                    <div className="product-rating-summary">
                        <div className="rating-stars">
                            {renderStars(Math.round(averageRating))}
                        </div>
                        <span className="rating-text">
                            {averageRating > 0 ? `${averageRating} (${reviewCount} reseña${reviewCount !== 1 ? 's' : ''})` : 'Sin reseñas'}
                        </span>
                    </div>

                    {/* Product price */}
                    <div className="detail-product-price">${product.price}</div>

                    {/* Add to cart button - opens quantity dialog */}
                    <button
                        className="detail-add-to-cart-btn"
                        onClick={() => setShowDialog(true)}
                    >
                        <LuShoppingCart className="detail-cart-icon" />
                        Add To Basket
                    </button>

                    {/* Product details section */}
                    <div className="detail-product-details-section">
                        <h3>Product Detail</h3>
                        <p className="detail-product-description">
                            {product.description || 'Apples are nutritious. Apples may be good for weight loss. Apples may be good for your heart. As part of a healthy and varied diet.'}
                        </p>
                    </div>

                    {/* Customer reviews section */}
                    <div className="detail-product-reviews">
                        <h3>Customer Reviews</h3>

                        {/* Loading state */}
                        {reviewsLoading && (
                            <div className="reviews-loading">
                                <LuRefreshCw className="spinner" />
                                <span>Cargando reseñas...</span>
                            </div>
                        )}

                        {/* Error state */}
                        {reviewsError && (
                            <div className="reviews-error">
                                <p>Error al cargar las reseñas: {reviewsError}</p>
                                <button onClick={fetchReviews} className="retry-btn">
                                    Reintentar
                                </button>
                            </div>
                        )}

                        {/* Reviews list */}
                        {!reviewsLoading && !reviewsError && (
                            <>
                                {productReviews.length === 0 ? (
                                    <p className="no-reviews">No hay reseñas para este producto aún.</p>
                                ) : (
                                    productReviews.map(reviewItem => (
                                        <div key={reviewItem._id} className="detail-review-item">
                                            {/* Review header with author, rating, and date */}
                                            <div className="detail-review-header">
                                                <div className="detail-review-author">
                                                    {reviewItem.usersId?.name || reviewItem.usersId?.username || 'Usuario Anónimo'}
                                                </div>
                                                {/* Star rating display */}
                                                <div className="detail-review-rating">
                                                    {renderStars(reviewItem.qualification)}
                                                </div>
                                                <div className="detail-review-date">
                                                    {formatDate(reviewItem.createdAt || new Date())}
                                                </div>
                                            </div>
                                            {/* Review text content */}
                                            <p className="detail-review-text">{reviewItem.comments}</p>
                                        </div>
                                    ))
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Review form section - appears after product info on mobile/tablet */}
                <div className="detail-review-form-container">
                    <div className="detail-review-form">
                        <h4>Add Your Review</h4>
                        
                        {/* Success message */}
                        {reviewSuccess && (
                            <div className="review-success-message">
                                {reviewSuccess}
                            </div>
                        )}
                        
                        {/* Review submission form */}
                        <form onSubmit={handleSubmitReview} className="review-form-grid">
                            {/* Star rating input */}
                            <div className="form-group">
                                <label>Your Rating</label>
                                <div className="rating-container">
                                    <div className="rating-stars">
                                        {renderStars(review.qualification, true, handleRatingChange)}
                                    </div>
                                    {/* Display current rating text */}
                                    <div className="rating-text">
                                        {review.qualification > 0 ? `${review.qualification} estrella${review.qualification > 1 ? 's' : ''}` : 'Selecciona una calificación'}
                                    </div>
                                </div>
                            </div>

                            {/* Review text input */}
                            <div className="form-group form-group-full">
                                <label htmlFor="review-comment">Your Review</label>
                                <textarea
                                    id="review-comment"
                                    name="comments"
                                    value={review.comments}
                                    onChange={handleReviewChange}
                                    required
                                    placeholder="Comparte tu experiencia con este producto"
                                    disabled={submittingReview}
                                />
                            </div>

                            {/* Submit button */}
                            <div className="form-group form-group-full">
                                <button
                                    type="submit"
                                    className="submit-review-btn"
                                    disabled={!review.qualification || !review.comments.trim() || submittingReview || !isLoggedIn}
                                >
                                    {submittingReview ? (
                                        <>
                                            <LuRefreshCw className="spinner" />
                                            Enviando...
                                        </>
                                    ) : (
                                        'Submit Review'
                                    )}
                                </button>
                                {!isLoggedIn && (
                                    <p className="login-required">
                                        Debes iniciar sesión para dejar una reseña
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Quantity selection dialog - shown when Add To Basket is clicked */}
            {showDialog && (
                <div className="dialog-overlay" onClick={() => setShowDialog(false)}>
                    {/* Dialog content - stops click propagation to prevent closing when clicking inside */}
                    <div className="quantity-dialog" onClick={(e) => e.stopPropagation()}>
                        {/* Close button */}
                        <button
                            className="dialog-close-btn"
                            onClick={() => setShowDialog(false)}
                            aria-label="Close dialog"
                        >
                            <LuX size={20} />
                        </button>

                        <h3>Select Quantity</h3>
                        <p>{product.name}</p>

                        {/* Quantity selector with +/- buttons and input */}
                        <div className="quantity-selector">
                            <button
                                className="quantity-btn"
                                onClick={decrementQuantity}
                                disabled={quantity <= 1}
                                aria-label="Decrease quantity"
                            >
                                <LuMinus size={16} />
                            </button>

                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={quantity}
                                onChange={(e) => {
                                    // Ensure quantity stays between 1-50
                                    const value = Math.min(50, Math.max(1, parseInt(e.target.value) || 1));
                                    setQuantity(value);
                                }}
                                className="quantity-input"
                                aria-label="Product quantity"
                            />

                            <button
                                className="quantity-btn"
                                onClick={incrementQuantity}
                                disabled={quantity >= 50}
                                aria-label="Increase quantity"
                            >
                                <LuPlus size={16} />
                            </button>
                        </div>

                        {/* Dialog action buttons */}
                        <div className="dialog-buttons">
                            <button
                                className="dialog-btn cancel-btn-dialog"
                                onClick={() => setShowDialog(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="dialog-btn confirm-btn"
                                onClick={() => handleAddToCart(true)}
                            >
                                Confirm ({quantity})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DetailProduct;