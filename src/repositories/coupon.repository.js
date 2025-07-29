const Coupon = require('../models/coupon.model');

class CouponRepository {
    async create(couponData) {
        return await Coupon.create(couponData);
    }

    async findById(id) {
        return await Coupon.findByPk(id);
    }

    async findByCode(code) {
        return await Coupon.findOne({ where: { code } });
    }

    async findActiveByCode(code) {
        return await Coupon.findOne({ 
            where: { 
                code, 
                isActive: true 
            } 
        });
    }

    async findAll(options = {}) {
        const defaultOptions = {
            order: [['createdAt', 'DESC']]
        };

        return await Coupon.findAll({
            ...defaultOptions,
            ...options
        });
    }

    async findActive(options = {}) {
        const defaultOptions = {
            where: { isActive: true },
            order: [['createdAt', 'DESC']]
        };

        return await Coupon.findAll({
            ...defaultOptions,
            ...options
        });
    }

    async update(id, updateData) {
        const coupon = await Coupon.findByPk(id);
        if (!coupon) return null;
        return await coupon.update(updateData);
    }

    async updateByCode(code, updateData) {
        const coupon = await Coupon.findOne({ where: { code } });
        if (!coupon) return null;
        return await coupon.update(updateData);
    }

    async delete(id) {
        const coupon = await Coupon.findByPk(id);
        if (!coupon) return false;
        await coupon.destroy();
        return true;
    }

    async incrementUsage(code) {
        const coupon = await Coupon.findOne({ where: { code } });
        if (!coupon) return null;
        return await coupon.increment('usedCount');
    }

    async getCouponStats() {
        const stats = await Coupon.findAll({
            attributes: [
                [Coupon.sequelize.fn('COUNT', Coupon.sequelize.col('id')), 'totalCoupons'],
                [Coupon.sequelize.fn('COUNT', Coupon.sequelize.fn('CASE', {
                    when: { isActive: true }
                })), 'activeCoupons'],
                [Coupon.sequelize.fn('SUM', Coupon.sequelize.col('usedCount')), 'totalUsage']
            ]
        });
        return stats[0];
    }

    async findExpiredCoupons() {
        const now = new Date();
        return await Coupon.findAll({
            where: {
                validUntil: {
                    [Coupon.sequelize.Op.lt]: now
                }
            }
        });
    }
}

module.exports = new CouponRepository(); 