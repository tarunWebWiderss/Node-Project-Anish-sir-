const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { sendWelcomeEmail } = require('../utils/mailer');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                status: 0,
                message: 'User already exists'
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        // Send welcome email
        try {
            await sendWelcomeEmail(user.email, user.name);
        } catch (mailErr) {
            console.error('Failed to send welcome email:', mailErr.message);
        }

        // Generate token
        const token = signToken(user.id);

        // Remove password from output
        const userWithoutPassword = user.toJSON();
        delete userWithoutPassword.password;

        res.status(201).json({
            status: 1,
            token,
            data: {
                user: userWithoutPassword
            }
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

        // Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({
                status: 0,
                message: 'Please provide email and password'
            });
        }

        // Check if user exists && password is correct
        const user = await User.findOne({ where: { email } });
        
        if (!user || !(await user.correctPassword(password))) {
            return res.status(401).json({
                status: 0,
                message: 'Incorrect email or password'
            });
        }

        // Generate token
        const token = signToken(user.id);

        // Remove password from output
        const userWithoutPassword = user.toJSON();
        delete userWithoutPassword.password;

        res.status(200).json({
            status: 1,
            token,
            data: {
                user: userWithoutPassword
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 0,
            message: error.message
        });
    }
}; 