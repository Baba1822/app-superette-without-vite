const Expense = require('../models/Expense');
const { validate } = require('../utils/validators');

exports.createExpense = async (req, res) => {
    try {
        const expenseId = await Expense.createExpense(req.body);
        res.status(201).json({ id: expenseId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la dépense' });
    }
};

exports.getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.getExpenseById(req.params.id);
        if (!expense) {
            return res.status(404).json({ error: 'Dépense non trouvée' });
        }
        res.json(expense);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la dépense' });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.getExpenses(req.query);
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des dépenses' });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        await Expense.updateExpense(req.params.id, req.body);
        res.json({ message: 'Dépense mise à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la dépense' });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        await Expense.deleteExpense(req.params.id);
        res.json({ message: 'Dépense supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la dépense' });
    }
};

exports.getExpenseReport = async (req, res) => {
    try {
        const report = await Expense.getExpenseReport(req.query);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la génération du rapport' });
    }
};
