const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const reviewRoutes = require('./routes/review.routes');
const couponRoutes = require('./routes/coupon.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const { authenticateToken } = require('./middleware/auth.middleware');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Protected dashboard route
app.get('/api/dashboard', authenticateToken, (req, res) => {
    res.json({
        status: 1,
        message: `Welcome to the dashboard, ${req.user.name || 'user'}!`,
        user: req.user
    });
});

// Logout endpoint (stateless for JWT)
app.post('/api/logout', (req, res) => {
    // For JWT, instruct client to delete token
    res.json({
        status: 1,
        message: 'Logged out successfully. Please delete your token on the client.'
    });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'coming-soon.html'));
});

// Database connection and sync
sequelize.sync()
    .then(() => {
        console.log('Database connected and synced');
        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });