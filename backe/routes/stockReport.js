const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { generateStockReport, getStockMovements, getStockValue, getStockAlerts } = require('../controllers/stockReportController');

// Routes pour les rapports de stock
router.get('/report', generateStockReport);
router.get('/movements/:productId', getStockMovements);
router.get('/value', getStockValue);
router.get('/alerts', getStockAlerts);

module.exports = router;
