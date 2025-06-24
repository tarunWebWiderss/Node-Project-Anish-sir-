const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();

exports.authenticateToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'No token provided'
            });
        }
        console.log('decoded1');
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('decoded',decoded);
        // Check if user still exists
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: 'User no longer exists'
            });
        }

        // Grant access to protected route
        req.user = user;
        next();
    } catch (error) {
        console.error('JWT Error:', error.message);
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid token',
            error: error.message // optional, remove in production
        });
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
}; 