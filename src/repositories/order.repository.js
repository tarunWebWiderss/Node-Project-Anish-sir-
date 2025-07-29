const Order = require('../models/order.model');
const User = require('../models/user.model');

class OrderRepository {
    async create(orderData) {
        return await Order.create(orderData);
    }

    async findById(id) {
        return await Order.findByPk(id);
    }

    async findByOrderId(orderId) {
        return await Order.findOne({ where: { orderId } });
    }

    async findByUserId(userId) {
        return await Order.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });
    }

    async findAll(options = {}) {
        const defaultOptions = {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        };

        return await Order.findAll({
            ...defaultOptions,
            ...options
        });
    }

    async update(id, updateData) {
        const order = await Order.findByPk(id);
        if (!order) return null;
        return await order.update(updateData);
    }

    async updateByOrderId(orderId, updateData) {
        const order = await Order.findOne({ where: { orderId } });
        if (!order) return null;
        return await order.update(updateData);
    }

    async delete(id) {
        const order = await Order.findByPk(id);
        if (!order) return false;
        await order.destroy();
        return true;
    }

    async getOrderStats() {
        const stats = await Order.findAll({
            attributes: [
                'status',
                [Order.sequelize.fn('COUNT', Order.sequelize.col('id')), 'count'],
                [Order.sequelize.fn('SUM', Order.sequelize.col('totalAmount')), 'totalRevenue']
            ],
            group: ['status']
        });
        return stats;
    }
}

module.exports = new OrderRepository(); 