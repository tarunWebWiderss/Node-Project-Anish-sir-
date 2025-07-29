const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { authenticateToken, hasRole } = require('../middleware/auth.middleware');

// Add Review (User Only)
router.post('/', authenticateToken, hasRole('user'), reviewController.addReview);

// Get Product Reviews (Public)
router.get('/product/:productId', reviewController.getProductReviews);

// Get Product Review Statistics (Public)
router.get('/product/:productId/stats', reviewController.getProductReviewStats);

// Update Review (User who created it)
router.put('/:reviewId', authenticateToken, reviewController.updateReview);

// Delete Review (User who created it or Admin)
router.delete('/:reviewId', authenticateToken, reviewController.deleteReview);

module.exports = router; 