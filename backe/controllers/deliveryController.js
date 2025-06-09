const Delivery = require('../models/Delivery');
const { validate } = require('../utils/validators');

exports.createDelivery = async (req, res) => {
    try {
        const deliveryId = await Delivery.createDelivery(req.body);
        res.status(201).json({ id: deliveryId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la livraison' });
    }
};

exports.getDeliveryById = async (req, res) => {
    try {
        const delivery = await Delivery.getDeliveryById(req.params.id);
        if (!delivery) {
            return res.status(404).json({ error: 'Livraison non trouvée' });
        }
        res.json(delivery);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la livraison' });
    }
};

exports.getDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.getDeliveries(req.query);
        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des livraisons' });
    }
};

exports.updateDeliveryStatus = async (req, res) => {
    try {
        const success = await Delivery.updateDeliveryStatus(
            req.params.id,
            req.body.status,
            req.body.note
        );
        if (!success) {
            return res.status(404).json({ error: 'Livraison non trouvée' });
        }
        res.json({ message: 'Statut de livraison mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
};

exports.assignToCourier = async (req, res) => {
    try {
        const success = await Delivery.assignDeliveryToCourier(
            req.params.id,
            req.body.courierId
        );
        if (!success) {
            return res.status(404).json({ error: 'Livraison non trouvée' });
        }
        res.json({ message: 'Livraison assignée au livreur avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'assignation au livreur' });
    }
};

exports.completeDelivery = async (req, res) => {
    try {
        const success = await Delivery.completeDelivery(
            req.params.id,
            req.body.rating
        );
        if (!success) {
            return res.status(404).json({ error: 'Livraison non trouvée' });
        }
        res.json({ message: 'Livraison complétée avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la complétion de la livraison' });
    }
};
