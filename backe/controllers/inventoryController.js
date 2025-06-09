const Inventory = require('../models/Inventory');
const { validate } = require('../utils/validators');

exports.getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.getInventory(req.query);
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'inventaire' });
    }
};

exports.getStockMovements = async (req, res) => {
    try {
        const movements = await Inventory.getStockMovements(req.params.productId, req.query);
        res.json(movements);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des mouvements de stock' });
    }
};

exports.getInventoryValue = async (req, res) => {
    try {
        const values = await Inventory.getInventoryValue(req.query);
        res.json(values);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la valeur de l\'inventaire' });
    }
};

exports.getStockAlerts = async (req, res) => {
    try {
        const alerts = await Inventory.getStockAlerts();
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des alertes de stock' });
    }
};
