const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { getClientOrders, getOrderDetails, getRecentOrders, getMonthlyStats } = require('../controllers/clientOrdersController');

// Routes pour les commandes du client
router.get('/:clientId', validate, getClientOrders);
router.get('/:clientId/recent', validate, getRecentOrders);
router.get('/:clientId/monthly-stats', validate, getMonthlyStats);
router.get('/details/:orderId', validate, getOrderDetails);

module.exports = router;
