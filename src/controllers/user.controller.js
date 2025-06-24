const userService = require('../services/user.service');
const tokenBlacklist = require('../utils/tokenBlacklist');

exports.getMe = async (req, res) => {
    try {
        const user = await userService.getMe(req.user.id);
        res.status(200).json({
            status: 1,
            data: { user }
        });
    } catch (error) {
        res.status(400).json({
            status: 0,
            message: error.message
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            status: 1,
            results: users.length,
            data: { users }
        });
    } catch (error) {
        res.status(400).json({
            status: 0,
            message: error.message
        });
    }
};

exports.updateMe = async (req, res) => {
    try {
        if (req.body.password) {
            return res.status(400).json({
                status: 0,
                message: 'This route is not for password updates. Please use /updatePassword'
            });
        }
        const updatedUser = await userService.updateMe(req.user.id, {
            name: req.body.name,
            email: req.body.email
        });
        res.status(200).json({
            status: 1,
            data: { user: updatedUser }
        });
    } catch (error) {
        res.status(400).json({
            status: 0,
            message: error.message
        });
    }
};

exports.logout = (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        tokenBlacklist.add(token);
    }
    res.json({
        status: 'success',
        message: 'Logged out successfully. Please delete your token on the client.'
    });
};

exports.authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (tokenBlacklist.has(token)) {
            return res.status(401).json({
                status: 'fail',
                message: 'Token has been invalidated. Please log in again.'
            });
        }
    }
    next();
}; 