const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { getSalesReport, getExpensesReport, getProfitReport, getInventoryValue } = require('../controllers/financialReportController');

// Routes pour les rapports financiers
router.get('/sales', validate, getSalesReport);
router.get('/expenses', validate, getExpensesReport);
router.get('/profit', validate, getProfitReport);
router.get('/inventory', getInventoryValue);

module.exports = router;
