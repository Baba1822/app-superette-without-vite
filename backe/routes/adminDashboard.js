const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { getDashboardStats, getTopProducts, getRecentOrders, getStockAlerts } = require('../controllers/adminDashboardController');

// Routes pour le dashboard admin
router.get('/stats', getDashboardStats);
router.get('/top-products', getTopProducts);
router.get('/recent-orders', getRecentOrders);
router.get('/stock-alerts', getStockAlerts);

module.exports = router;
