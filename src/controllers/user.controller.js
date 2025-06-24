const User = require('../models/user.model');

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.status(200).json({
            status: 1,
            data: {
                user
            }
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
        const users = await User.find();
        res.status(200).json({
            status: 1,
            results: users.length,
            data: {
                users
            }
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
        // Prevent password update on this route
        if (req.body.password) {
            return res.status(400).json({
                status: 0,
                message: 'This route is not for password updates. Please use /updatePassword'
            });
        }

        await User.update(
            {
                name: req.body.name,
                email: req.body.email
            },
            {
                where: { id: req.user.id },
                individualHooks: true
            }
        );
        const updatedUser = await User.findByPk(req.user.id);

        res.status(200).json({
            status: 1,
            data: {
                user: updatedUser
            }
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