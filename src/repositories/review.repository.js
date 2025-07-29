const Review = require('../models/review.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');

class ReviewRepository {
    async create(reviewData) {
        return await Review.create(reviewData);
    }

    async findById(id) {
        return await Review.findByPk(id);
    }

    async findByProductId(productId, options = {}) {
        const defaultOptions = {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']]
        };

        return await Review.findAll({
            where: { productId },
            ...defaultOptions,
            ...options
        });
    }

    async findByUserId(userId) {
        return await Review.findAll({
            where: { userId },
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    }

    async findByUserAndProduct(userId, productId) {
        return await Review.findOne({
            where: { userId, productId }
        });
    }

    async findAll(options = {}) {
        const defaultOptions = {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name']
                },
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']]
        };

        return await Review.findAll({
            ...defaultOptions,
            ...options
        });
    }

    async update(id, updateData) {
        const review = await Review.findByPk(id);
        if (!review) return null;
        return await review.update(updateData);
    }

    async delete(id) {
        const review = await Review.findByPk(id);
        if (!review) return false;
        await review.destroy();
        return true;
    }

    async getProductReviewStats(productId) {
        const stats = await Review.findAll({
            where: { productId },
            attributes: [
                [Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'averageRating'],
                [Review.sequelize.fn('COUNT', Review.sequelize.col('id')), 'totalReviews'],
                [Review.sequelize.fn('COUNT', Review.sequelize.fn('CASE', {
                    when: { rating: 5 }
                })), 'fiveStar'],
                [Review.sequelize.fn('COUNT', Review.sequelize.fn('CASE', {
                    when: { rating: 4 }
                })), 'fourStar'],
                [Review.sequelize.fn('COUNT', Review.sequelize.fn('CASE', {
                    when: { rating: 3 }
                })), 'threeStar'],
                [Review.sequelize.fn('COUNT', Review.sequelize.fn('CASE', {
                    when: { rating: 2 }
                })), 'twoStar'],
                [Review.sequelize.fn('COUNT', Review.sequelize.fn('CASE', {
                    when: { rating: 1 }
                })), 'oneStar']
            ]
        });
        return stats[0];
    }
}

module.exports = new ReviewRepository(); 