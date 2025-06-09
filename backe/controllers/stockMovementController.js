const StockMovement = require('../models/StockMovement');
const { validate } = require('../utils/validators');

module.exports.createMovement = async (req, res) => {
    try {
        const movementId = await StockMovement.createMovement(req.body);
        res.status(201).json({ id: movementId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du mouvement de stock' });
    }
};

module.exports.getMovements = async (req, res) => {
    try {
        const movements = await StockMovement.getMovements(req.query);
        res.json(movements);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des mouvements de stock' });
    }
};

exports.getCurrentStock = async (req, res) => {
    try {
        const stock = await StockMovement.getCurrentStock(req.params.productId);
        res.json({ stock });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du stock' });
    }
};

module.exports.updateProductStock = async (req, res) => {
    try {
        await StockMovement.updateProductStock(req.params.productId, req.body.quantity);
        res.json({ message: 'Stock mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du stock' });
    }
};
