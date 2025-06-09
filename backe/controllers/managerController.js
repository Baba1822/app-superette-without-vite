const Manager = require('../models/Manager');
const { validate } = require('../utils/validators');

exports.getManagerStats = async (req, res) => {
    try {
        const stats = await Manager.getManagerStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
};

exports.getManagerReports = async (req, res) => {
    try {
        const reports = await Manager.getManagerReports(req.query);
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des rapports' });
    }
};

exports.getTopPerformers = async (req, res) => {
    try {
        const performers = await Manager.getTopPerformers();
        res.json(performers);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des meilleurs performeurs' });
    }
};

exports.getStockAlerts = async (req, res) => {
    try {
        const alerts = await Manager.getStockAlerts();
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des alertes de stock' });
    }
};

exports.getPendingTasks = async (req, res) => {
    try {
        const tasks = await Manager.getPendingTasks();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des tâches en attente' });
    }
};
