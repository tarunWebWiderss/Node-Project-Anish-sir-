const userRepository = require('../repositories/user.repository');

const userService = {
    getMe: async (userId) => userRepository.findById(userId),
    getAllUsers: async () => userRepository.findAll(),
    updateMe: async (userId, updateData) => {
        await userRepository.update(updateData, { where: { id: userId }, individualHooks: true });
        return userRepository.findById(userId);
    },
};

module.exports = userService; 