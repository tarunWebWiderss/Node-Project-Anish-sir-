const User = require('../models/user.model');

const authRepository = {
    findOneByEmail: async (email) => User.findOne({ where: { email } }),
    createUser: async (data) => User.create(data),
};

module.exports = authRepository; 