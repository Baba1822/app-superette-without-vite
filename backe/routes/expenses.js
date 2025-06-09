const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { createExpense, getExpenseById, getExpenses, updateExpense, deleteExpense, getExpenseReport } = require('../controllers/expenseController');

// Routes pour les dépenses
router.post('/', validate, createExpense);
router.get('/:id', getExpenseById);
router.get('/', getExpenses);
router.put('/:id', validate, updateExpense);
router.delete('/:id', deleteExpense);
router.get('/report', getExpenseReport);

module.exports = router;
