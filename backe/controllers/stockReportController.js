const StockReport = require('../models/StockReport');
const { validate } = require('../utils/validators');

exports.generateStockReport = async (req, res) => {
    try {
        const report = await StockReport.generateStockReport(req.query);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la génération du rapport de stock' });
    }
};

exports.getStockMovements = async (req, res) => {
    try {
        const movements = await StockReport.getStockMovements(req.params.productId, req.query);
        res.json(movements);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des mouvements de stock' });
    }
};

exports.getStockValue = async (req, res) => {
    try {
        const values = await StockReport.getStockValue(req.query);
        res.json(values);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la valeur du stock' });
    }
};

exports.getStockAlerts = async (req, res) => {
    try {
        const alerts = await StockReport.getStockAlerts();
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des alertes de stock' });
    }
};
