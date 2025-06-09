const Finance = require('../models/Finance');
const { validate } = require('../utils/validators');

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Finance.getExpenses(req.query);
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des dépenses' });
    }
};

exports.createExpense = async (req, res) => {
    try {
        const expenseId = await Finance.createExpense(req.body);
        res.status(201).json({ id: expenseId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la dépense' });
    }
};

exports.getExpenseReport = async (req, res) => {
    try {
        const report = await Finance.getExpenseReport(req.query);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la génération du rapport' });
    }
};

exports.getFinancialSummary = async (req, res) => {
    try {
        const summary = await Finance.getFinancialSummary();
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du résumé financier' });
    }
};
