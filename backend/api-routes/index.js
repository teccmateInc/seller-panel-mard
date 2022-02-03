const expressRouter = require('express').Router;
const router = expressRouter();

// User routes
const userRoutes = require('./users');
router.use('/user', userRoutes);

// Admin routes
const adminRoutes = require('./admin');
router.use('/admin', adminRoutes);

module.exports = router
