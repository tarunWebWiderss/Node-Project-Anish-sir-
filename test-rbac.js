const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testUsers = {
    admin: { email: 'admin@example.com', password: 'password123' },
    seller: { email: 'seller@example.com', password: 'password123' },
    user: { email: 'user@example.com', password: 'password123' }
};

let tokens = {};

async function loginUser(role) {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, testUsers[role]);
        tokens[role] = response.data.data.token;
        console.log(`✅ ${role} login successful`);
        return tokens[role];
    } catch (error) {
        console.log(`❌ ${role} login failed:`, error.response?.data?.message || error.message);
        return null;
    }
}

async function testAuthMiddleware() {
    console.log('\n🔐 Testing Authentication Middleware...');
    
    // Test without token
    try {
        await axios.get(`${BASE_URL}/users`);
        console.log('❌ Should have failed without token');
    } catch (error) {
        if (error.response?.data?.message === 'No token provided') {
            console.log('✅ No token error handled correctly');
        } else {
            console.log('❌ Unexpected error:', error.response?.data?.message);
        }
    }
    
    // Test with invalid token
    try {
        await axios.get(`${BASE_URL}/users`, {
            headers: { Authorization: 'Bearer invalid-token' }
        });
        console.log('❌ Should have failed with invalid token');
    } catch (error) {
        if (error.response?.data?.message === 'Authentication failed') {
            console.log('✅ Invalid token error handled correctly');
        } else {
            console.log('❌ Unexpected error:', error.response?.data?.message);
        }
    }
}

async function testRoleBasedAccess() {
    console.log('\n👥 Testing Role-Based Access Control...');
    
    // Test admin access to all endpoints
    if (tokens.admin) {
        try {
            await axios.get(`${BASE_URL}/products`, {
                headers: { Authorization: `Bearer ${tokens.admin}` }
            });
            console.log('✅ Admin can access products');
        } catch (error) {
            console.log('❌ Admin cannot access products:', error.response?.data?.message);
        }
    }
    
    // Test user access restrictions
    if (tokens.user) {
        try {
            await axios.post(`${BASE_URL}/products`, {
                name: 'Test Product',
                price: 100,
                categoryId: 1
            }, {
                headers: { Authorization: `Bearer ${tokens.user}` }
            });
            console.log('❌ User should not be able to create products');
        } catch (error) {
            if (error.response?.data?.message === 'Access denied: insufficient permissions') {
                console.log('✅ User correctly denied access to create products');
            } else {
                console.log('❌ Unexpected error:', error.response?.data?.message);
            }
        }
    }
}

async function testOrderModule() {
    console.log('\n📦 Testing Order Module...');
    
    if (tokens.user) {
        try {
            const orderData = {
                products: [
                    { productId: 3, quantity: 1 }
                ],
                shippingAddress: '123 Test St, Test City, TC 12345'
            };
            
            const response = await axios.post(`${BASE_URL}/orders`, orderData, {
                headers: { Authorization: `Bearer ${tokens.user}` }
            });
            
            console.log('✅ Order placed successfully:', response.data.data.orderId);
            
            // Test get user orders
            const userOrders = await axios.get(`${BASE_URL}/orders/user`, {
                headers: { Authorization: `Bearer ${tokens.user}` }
            });
            console.log('✅ User orders retrieved:', userOrders.data.data.length, 'orders');
            
        } catch (error) {
            console.log('❌ Order placement failed:', error.response?.data?.message);
        }
    }
    
    // Test admin/seller access to all orders
    if (tokens.admin) {
        try {
            const allOrders = await axios.get(`${BASE_URL}/orders`, {
                headers: { Authorization: `Bearer ${tokens.admin}` }
            });
            console.log('✅ Admin can view all orders:', allOrders.data.data.length, 'orders');
        } catch (error) {
            console.log('❌ Admin cannot view all orders:', error.response?.data?.message);
        }
    }
}

async function testReviewModule() {
    console.log('\n💬 Testing Review Module...');
    
    if (tokens.user) {
        try {
            const reviewData = {
                productId: 3,
                rating: 5,
                comment: 'Excellent product!'
            };
            
            const response = await axios.post(`${BASE_URL}/reviews`, reviewData, {
                headers: { Authorization: `Bearer ${tokens.user}` }
            });
            
            console.log('✅ Review submitted successfully');
            
        } catch (error) {
            console.log('❌ Review submission failed:', error.response?.data?.message);
        }
    }
    
    // Test get product reviews (public)
    try {
        const reviews = await axios.get(`${BASE_URL}/reviews/product/3`);
        console.log('✅ Product reviews retrieved:', reviews.data.data.length, 'reviews');
    } catch (error) {
        console.log('❌ Cannot retrieve product reviews:', error.response?.data?.message);
    }
}

async function testCouponModule() {
    console.log('\n🏷️ Testing Coupon Module...');
    
    // Test get active coupons (public)
    try {
        const coupons = await axios.get(`${BASE_URL}/coupons/active`);
        console.log('✅ Active coupons retrieved:', coupons.data.data.coupons.length, 'coupons');
    } catch (error) {
        console.log('❌ Cannot retrieve active coupons:', error.response?.data?.message);
    }
    
    // Test admin access to coupon management
    if (tokens.admin) {
        try {
            const allCoupons = await axios.get(`${BASE_URL}/coupons/all`, {
                headers: { Authorization: `Bearer ${tokens.admin}` }
            });
            console.log('✅ Admin can view all coupons:', allCoupons.data.data.coupons.length, 'coupons');
        } catch (error) {
            console.log('❌ Admin cannot view all coupons:', error.response?.data?.message);
        }
    }
}

async function testProductOwnership() {
    console.log('\n🏪 Testing Product Ownership...');
    
    if (tokens.seller) {
        try {
            // Create a product as seller
            const productData = {
                name: 'Seller Product',
                price: 200,
                categoryId: 1,
                stock: 10
            };
            
            const response = await axios.post(`${BASE_URL}/products`, productData, {
                headers: { Authorization: `Bearer ${tokens.seller}` }
            });
            
            console.log('✅ Seller can create products');
            const productId = response.data.data.product.id;
            
            // Try to update the product
            const updateData = { price: 250 };
            await axios.put(`${BASE_URL}/products/${productId}`, updateData, {
                headers: { Authorization: `Bearer ${tokens.seller}` }
            });
            console.log('✅ Seller can update their own products');
            
        } catch (error) {
            console.log('❌ Seller product operations failed:', error.response?.data?.message);
        }
    }
}

async function testDashboardStats() {
    console.log('\n📊 Testing Dashboard Statistics...');
    
    if (tokens.admin) {
        try {
            const stats = await axios.get(`${BASE_URL}/dashboard/stats`, {
                headers: { Authorization: `Bearer ${tokens.admin}` }
            });
            console.log('✅ Dashboard stats retrieved successfully');
            console.log('   - Total Orders:', stats.data.data.orders.total);
            console.log('   - Total Products:', stats.data.data.products.total);
            console.log('   - Total Coupons:', stats.data.data.coupons.total);
            console.log('   - Total Reviews:', stats.data.data.reviews.total);
        } catch (error) {
            console.log('❌ Cannot retrieve dashboard stats:', error.response?.data?.message);
        }
    }
}

async function runAllTests() {
    console.log('🚀 Starting RBAC System Tests...\n');
    
    // Login all users
    console.log('🔑 Logging in users...');
    await loginUser('admin');
    await loginUser('seller');
    await loginUser('user');
    
    // Run all test modules
    await testAuthMiddleware();
    await testRoleBasedAccess();
    await testOrderModule();
    await testReviewModule();
    await testCouponModule();
    await testProductOwnership();
    await testDashboardStats();
    
    console.log('\n✅ All tests completed!');
}

// Run tests
runAllTests().catch(console.error); 