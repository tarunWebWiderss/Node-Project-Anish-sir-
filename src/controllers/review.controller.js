const reviewService = require('../services/review.service');
const { sendResponse } = require('../utils/response');

class ReviewController {
    // Add Review (User Only)
    async addReview(req, res) {
        try {
            const userId = req.user.id;
            const reviewData = req.body;
            
            const result = await reviewService.addReview(userId, reviewData);
            
            return sendResponse(res, {
                status: 1,
                message: result.message,
                data: { reviewId: result.reviewId },
                httpCode: 201
            });
            
        } catch (error) {
            return sendResponse(res, {
                status: 0,
                message: error.message,
                data: null,
                httpCode: 400
            });
        }
    }
    
    // Get Product Reviews
    async getProductReviews(req, res) {
        try {
            const { productId } = req.params;
            const reviews = await reviewService.getProductReviews(productId);
            
            return sendResponse(res, {
                status: 1,
                message: 'Product reviews retrieved successfully',
                data: reviews,
                httpCode: 200
            });
            
        } catch (error) {
            return sendResponse(res, {
                status: 0,
                message: error.message,
                data: null,
                httpCode: 400
            });
        }
    }
    
    // Get Product Review Statistics
    async getProductReviewStats(req, res) {
        try {
            const { productId } = req.params;
            const stats = await reviewService.getProductReviewStats(productId);
            
            return sendResponse(res, {
                status: 1,
                message: 'Product review statistics retrieved successfully',
                data: stats,
                httpCode: 200
            });
            
        } catch (error) {
            return sendResponse(res, {
                status: 0,
                message: error.message,
                data: null,
                httpCode: 400
            });
        }
    }
    
    // Update Review (User who created it)
    async updateReview(req, res) {
        try {
            const userId = req.user.id;
            const { reviewId } = req.params;
            const updateData = req.body;
            
            const result = await reviewService.updateReview(userId, reviewId, updateData);
            
            return sendResponse(res, {
                status: 1,
                message: result.message,
                data: null,
                httpCode: 200
            });
            
        } catch (error) {
            return sendResponse(res, {
                status: 0,
                message: error.message,
                data: null,
                httpCode: 400
            });
        }
    }
    
    // Delete Review (User who created it or Admin)
    async deleteReview(req, res) {
        try {
            const userId = req.user.id;
            const userRole = req.user.role;
            const { reviewId } = req.params;
            
            const result = await reviewService.deleteReview(userId, reviewId, userRole);
            
            return sendResponse(res, {
                status: 1,
                message: result.message,
                data: null,
                httpCode: 200
            });
            
        } catch (error) {
            return sendResponse(res, {
                status: 0,
                message: error.message,
                data: null,
                httpCode: 400
            });
        }
    }
}

module.exports = new ReviewController(); 