const FinancialReport = require('../models/FinancialReport');
const { validate } = require('../utils/validators');

exports.getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const report = await FinancialReport.getSalesReport(startDate, endDate);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la génération du rapport de ventes' });
    }
};

exports.getExpensesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const report = await FinancialReport.getExpensesReport(startDate, endDate);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la génération du rapport des dépenses' });
    }
};

exports.getProfitReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const report = await FinancialReport.getProfitReport(startDate, endDate);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la génération du rapport de bénéfice' });
    }
};

exports.getInventoryValue = async (req, res) => {
    try {
        const value = await FinancialReport.getInventoryValue();
        res.json(value);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la valeur d\'inventaire' });
    }
};
