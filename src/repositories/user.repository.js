const User = require('../models/user.model');

const userRepository = {
    findById: async (id) => User.findByPk(id),
    findAll: async () => User.find(),
    findOne: async (query) => User.findOne(query),
    create: async (data) => User.create(data),
    update: async (data, options) => User.update(data, options),
};

module.exports = userRepository; 