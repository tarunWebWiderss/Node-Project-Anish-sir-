const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, restrictTo } = require('../middleware/auth.middleware');

// Protected routes
router.get('/me', authenticateToken, userController.getMe);
router.patch('/updateMe', authenticateToken, userController.updateMe);

// Admin only routes
router.get('/all', authenticateToken, restrictTo('admin'), userController.getAllUsers);

module.exports = router; 