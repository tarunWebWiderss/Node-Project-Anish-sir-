const couponRepository = require('../repositories/coupon.repository');

class CouponService {
    async createCoupon(couponData) {
        try {
            // Check if coupon code already exists
            const existingCoupon = await couponRepository.findByCode(couponData.code);
            if (existingCoupon) {
                throw new Error('Coupon code already exists');
            }

            return await couponRepository.create(couponData);
        } catch (error) {
            throw error;
        }
    }

    async getAllCoupons() {
        try {
            return await couponRepository.findAll();
        } catch (error) {
            throw error;
        }
    }

    async getActiveCoupons() {
        try {
            return await couponRepository.findActive();
        } catch (error) {
            throw error;
        }
    }

    async getCouponById(id) {
        try {
            const coupon = await couponRepository.findById(id);
            if (!coupon) {
                throw new Error('Coupon not found');
            }
            return coupon;
        } catch (error) {
            throw error;
        }
    }

    async getCouponByCode(code) {
        try {
            const coupon = await couponRepository.findByCode(code);
            if (!coupon) {
                throw new Error('Coupon not found');
            }
            return coupon;
        } catch (error) {
            throw error;
        }
    }

    async updateCoupon(id, updateData) {
        try {
            const coupon = await couponRepository.update(id, updateData);
            if (!coupon) {
                throw new Error('Coupon not found');
            }
            return coupon;
        } catch (error) {
            throw error;
        }
    }

    async deleteCoupon(id) {
        try {
            const deleted = await couponRepository.delete(id);
            if (!deleted) {
                throw new Error('Coupon not found');
            }
            return { message: 'Coupon deleted successfully' };
        } catch (error) {
            throw error;
        }
    }

    async validateCoupon(code, orderAmount) {
        try {
            const coupon = await couponRepository.findActiveByCode(code);
            if (!coupon) {
                throw new Error('Invalid coupon code');
            }

            const now = new Date();
            if (now < coupon.validFrom || now > coupon.validUntil) {
                throw new Error('Coupon is not valid at this time');
            }

            if (orderAmount < coupon.minOrderAmount) {
                throw new Error(`Minimum order amount of $${coupon.minOrderAmount} required`);
            }

            if (coupon.usageLimit !== -1 && coupon.usedCount >= coupon.usageLimit) {
                throw new Error('Coupon usage limit exceeded');
            }

            return coupon;
        } catch (error) {
            throw error;
        }
    }

    async applyCoupon(code, orderAmount) {
        try {
            const coupon = await this.validateCoupon(code, orderAmount);
            
            let discountAmount = 0;
            if (coupon.discountType === 'percentage') {
                discountAmount = (orderAmount * coupon.discountValue) / 100;
            } else {
                discountAmount = coupon.discountValue;
            }

            // Apply maximum discount cap if set
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
            }

            // Increment usage count
            await couponRepository.incrementUsage(code);

            return {
                coupon,
                discountAmount: parseFloat(discountAmount.toFixed(2)),
                newTotal: parseFloat((orderAmount - discountAmount).toFixed(2))
            };
        } catch (error) {
            throw error;
        }
    }

    async getCouponStats() {
        try {
            return await couponRepository.getCouponStats();
        } catch (error) {
            throw error;
        }
    }

    async deactivateExpiredCoupons() {
        try {
            const expiredCoupons = await couponRepository.findExpiredCoupons();
            for (const coupon of expiredCoupons) {
                await couponRepository.update(coupon.id, { isActive: false });
            }
            return { message: `${expiredCoupons.length} expired coupons deactivated` };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CouponService(); 