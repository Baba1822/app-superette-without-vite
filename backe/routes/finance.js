const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { getExpenses, createExpense, getExpenseReport, getFinancialSummary } = require('../controllers/financeController');

// Routes pour la finance
router.get('/expenses', getExpenses);
router.post('/expenses', validate, createExpense);
router.get('/expenses/report', getExpenseReport);
router.get('/summary', getFinancialSummary);

module.exports = router;
