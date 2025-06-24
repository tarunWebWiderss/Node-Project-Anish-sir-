const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { sendWelcomeEmail } = require('../utils/mailer');
const authService = require('../services/auth.service');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const { token, user } = await authService.register({ name, email, password, role });
        res.status(201).json({
            status: 1,
            token,
            data: { user }
        });
    } catch (error) {
        res.status(400).json({
            status: 0,
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await authService.login({ email, password });
        res.status(200).json({
            status: 1,
            token,
            data: { user }
        });
    } catch (error) {
        res.status(400).json({
            status: 0,
            message: error.message
        });
    }
}; 