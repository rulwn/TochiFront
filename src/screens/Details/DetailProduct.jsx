// Import necessary React hooks and components
import React, { useState } from 'react';
// Import icons from react-icons library
import { LuShoppingCart, LuX, LuPlus, LuMinus, LuArrowLeft } from 'react-icons/lu';
// Import routing utilities from react-router-dom
import { useLocation, useNavigate } from 'react-router-dom';
// Import CSS styles for this component
import './DetailProduct.css';

// Main DetailProduct component that receives onAddToCart function as prop
function DetailProduct({ onAddToCart }) {
    // React Router hooks to access current location and navigation
    const location = useLocation();
    const navigate = useNavigate();
    // Get product data passed via route state
    const product = location.state?.product;

    // State management for various component features:
    
    // Controls visibility of quantity selection dialog
    const [showDialog, setShowDialog] = useState(false);
    // Tracks selected product quantity (defaults to 1)
    const [quantity, setQuantity] = useState(1);
    // Manages form state for product reviews
    const [review, setReview] = useState({
        rating: 0,       // Star rating (0-5)
        comment: ''      // Review text
    });
    // Stores all product reviews (initialized with one sample review)
    const [reviews, setReviews] = useState([
        {
            id: 1,
            author: 'Willfredo Granados',
            rating: 5,
            comment: 'Apples are nutritious. Apples may be good for weight loss. Apples may be good for your',
            date: '2023-05-15'
        }
    ]);

    // Redirect to home if no product data is available
    if (!product) {
        navigate('/');
        return null;
    }

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
        setReview(prev => ({ ...prev, rating: newRating }));
    };

    // Handles review form submission
    const handleSubmitReview = (e) => {
        e.preventDefault();
        // Only submit if rating and comment are provided
        if (review.rating > 0 && review.comment) {
            // Create new review object
            const newReview = {
                id: reviews.length + 1,
                author: "User", // Placeholder - would be dynamic in real app
                rating: review.rating,
                comment: review.comment,
                date: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
            };
            // Add new review to reviews array
            setReviews([...reviews, newReview]);
            // Reset form
            setReview({ rating: 0, comment: '' });
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

                        {/* Map through all reviews and display them */}
                        {reviews.map(item => (
                            <div key={item.id} className="detail-review-item">
                                {/* Review header with author, rating, and date */}
                                <div className="detail-review-header">
                                    <div className="detail-review-author">{item.author}</div>
                                    {/* Star rating display */}
                                    <div className="detail-review-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <span
                                                key={i}
                                                className={`star ${i < item.rating ? 'filled' : ''}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <div className="detail-review-date">{item.date}</div>
                                </div>
                                {/* Review text content */}
                                <p className="detail-review-text">{item.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Review form section - appears after product info on mobile/tablet */}
                <div className="detail-review-form-container">
                    <div className="detail-review-form">
                        <h4>Add Your Review</h4>
                        {/* Review submission form */}
                        <form onSubmit={handleSubmitReview} className="review-form-grid">
                            {/* Star rating input */}
                            <div className="form-group">
                                <label>Your Rating</label>
                                <div className="rating-container">
                                    <div className="rating-stars">
                                        {/* Render 5 clickable stars */}
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span
                                                key={star}
                                                className={`star ${star <= review.rating ? 'filled' : ''}`}
                                                onClick={() => handleRatingChange(star)}
                                                aria-label={`${star} star`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    {/* Display current rating text */}
                                    <div className="rating-text">
                                        {review.rating > 0 ? `${review.rating} star${review.rating > 1 ? 's' : ''}` : 'Select rating'}
                                    </div>
                                </div>
                            </div>

                            {/* Review text input */}
                            <div className="form-group form-group-full">
                                <label htmlFor="review-comment">Your Review</label>
                                <textarea
                                    id="review-comment"
                                    name="comment"
                                    value={review.comment}
                                    onChange={handleReviewChange}
                                    required
                                    placeholder="Share your experience with this product"
                                />
                            </div>

                            {/* Submit button */}
                            <div className="form-group form-group-full">
                                <button
                                    type="submit"
                                    className="submit-review-btn"
                                    disabled={!review.rating || !review.comment}
                                >
                                    Submit Review
                                </button>
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
                                className="dialog-btn cancel-btn"
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