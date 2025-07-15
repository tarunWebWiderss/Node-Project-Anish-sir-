const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { sendResponse } = require('../utils/response');
require('dotenv').config();

exports.authenticateToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return sendResponse(res, {
                status: 0,
                message: 'No token provided',
                data: null,
                httpCode: 401
            });
        }
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check if user still exists
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return sendResponse(res, {
                status: 0,
                message: 'User no longer exists',
                data: null,
                httpCode: 401
            });
        }
        // Grant access to protected route
        req.user = user;
        next();
    } catch (error) {
        return sendResponse(res, {
            status: 0,
            message: 'Invalid token',
            data: null,
            httpCode: 401
        });
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return sendResponse(res, {
                status: 0,
                message: 'You do not have permission to perform this action',
                data: null,
                httpCode: 403
            });
        }
        next();
    };
}; 