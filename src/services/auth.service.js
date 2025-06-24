const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/auth.repository');
const { sendWelcomeEmail } = require('../utils/mailer');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

const authService = {
    register: async ({ name, email, password, role }) => {
        const existingUser = await authRepository.findOneByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const user = await authRepository.createUser({ name, email, password, role });
        try {
            await sendWelcomeEmail(user.email, user.name);
        } catch (mailErr) {
            console.error('Failed to send welcome email:', mailErr.message);
        }
        const token = signToken(user.id);
        const userWithoutPassword = user.toJSON();
        delete userWithoutPassword.password;
        return { token, user: userWithoutPassword };
    },
    login: async ({ email, password }) => {
        if (!email || !password) {
            throw new Error('Please provide email and password');
        }
        const user = await authRepository.findOneByEmail(email);
        if (!user || !(await user.correctPassword(password))) {
            throw new Error('Incorrect email or password');
        }
        const token = signToken(user.id);
        const userWithoutPassword = user.toJSON();
        delete userWithoutPassword.password;
        return { token, user: userWithoutPassword };
    },
};

module.exports = authService; 