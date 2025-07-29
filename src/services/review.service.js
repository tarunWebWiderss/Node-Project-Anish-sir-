const Review = require('../models/review.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');

class ReviewService {
    // Add review (User only)
    async addReview(userId, reviewData) {
        try {
            const { productId, rating, comment } = reviewData;
            
            // Check if product exists
            const product = await Product.findByPk(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            
            // Check if user already reviewed this product
            const existingReview = await Review.findOne({
                where: { userId, productId }
            });
            
            if (existingReview) {
                throw new Error('You have already reviewed this product');
            }
            
            // Create review
            const review = await Review.create({
                userId,
                productId,
                rating,
                comment
            });
            
            return {
                message: 'Review submitted successfully',
                reviewId: review.id
            };
            
        } catch (error) {
            throw error;
        }
    }
    
    // Get product reviews
    async getProductReviews(productId) {
        try {
            const reviews = await Review.findAll({
                where: { productId },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
            
            return reviews.map(review => ({
                user: review.user,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt
            }));
            
        } catch (error) {
            throw error;
        }
    }
    
    // Get review statistics for a product
    async getProductReviewStats(productId) {
        try {
            const reviews = await Review.findAll({
                where: { productId }
            });
            
            if (reviews.length === 0) {
                return {
                    averageRating: 0,
                    totalReviews: 0,
                    ratingDistribution: {}
                };
            }
            
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / reviews.length;
            
            const ratingDistribution = {};
            for (let i = 1; i <= 5; i++) {
                ratingDistribution[i] = reviews.filter(review => review.rating === i).length;
            }
            
            return {
                averageRating: parseFloat(averageRating.toFixed(1)),
                totalReviews: reviews.length,
                ratingDistribution
            };
            
        } catch (error) {
            throw error;
        }
    }
    
    // Update review (only by the user who created it)
    async updateReview(userId, reviewId, updateData) {
        try {
            const review = await Review.findOne({
                where: { id: reviewId, userId }
            });
            
            if (!review) {
                throw new Error('Review not found or you are not authorized to update it');
            }
            
            await review.update(updateData);
            
            return {
                message: 'Review updated successfully'
            };
            
        } catch (error) {
            throw error;
        }
    }
    
    // Delete review (only by the user who created it or admin)
    async deleteReview(userId, reviewId, userRole) {
        try {
            const whereClause = { id: reviewId };
            if (userRole !== 'admin') {
                whereClause.userId = userId;
            }
            
            const review = await Review.findOne({ where: whereClause });
            
            if (!review) {
                throw new Error('Review not found or you are not authorized to delete it');
            }
            
            await review.destroy();
            
            return {
                message: 'Review deleted successfully'
            };
            
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ReviewService(); 