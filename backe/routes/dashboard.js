const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { getDashboardStats, getSalesByCategory, getDeliveryStats, getCustomerStats } = require('../controllers/dashboardController');

// Routes pour le dashboard
router.get('/stats', getDashboardStats);
router.get('/sales-by-category', getSalesByCategory);
router.get('/delivery-stats', getDeliveryStats);
router.get('/customer-stats', getCustomerStats);

module.exports = router;
