const DeliveryManagement = require('../models/DeliveryManagement');
const { validate } = require('../utils/validators');

exports.getDeliveries = async (req, res) => {
    try {
        const deliveries = await DeliveryManagement.getDeliveries(req.query);
        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des livraisons' });
    }
};

exports.createDelivery = async (req, res) => {
    try {
        const deliveryId = await DeliveryManagement.createDelivery(req.body);
        await DeliveryManagement.addDeliveryDetails(deliveryId, req.body.products);
        res.status(201).json({ id: deliveryId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la livraison' });
    }
};

exports.updateDeliveryStatus = async (req, res) => {
    try {
        await DeliveryManagement.updateDeliveryStatus(req.params.deliveryId, req.body.status);
        res.json({ message: 'Statut de livraison mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
};

exports.assignCourier = async (req, res) => {
    try {
        await DeliveryManagement.assignCourier(req.params.deliveryId, req.body.courierId);
        res.json({ message: 'Livraison affectée au coursier avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'affectation du coursier' });
    }
};

exports.getDeliveryById = async (req, res) => {
    try {
        const delivery = await DeliveryManagement.getDeliveryById(req.params.deliveryId);
        if (!delivery) {
            return res.status(404).json({ error: 'Livraison non trouvée' });
        }
        res.json(delivery);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la livraison' });
    }
};
