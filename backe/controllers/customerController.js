const Customer = require('../models/Customer');
const { validate } = require('../utils/validators');

exports.createCustomer = async (req, res) => {
    try {
        const customerId = await Customer.create(req.body);
        res.status(201).json({ id: customerId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du client' });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.getById(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du client' });
    }
};

exports.getCustomerByEmail = async (req, res) => {
    try {
        const customer = await Customer.getByEmail(req.params.email);
        if (!customer) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du client' });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        await Customer.update(req.params.id, req.body);
        res.json({ message: 'Client mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du client' });
    }
};

exports.getPurchaseHistory = async (req, res) => {
    try {
        const history = await Customer.getPurchaseHistory(req.params.id);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
    }
};

exports.getLoyaltyPoints = async (req, res) => {
    try {
        const points = await Customer.getLoyaltyPoints(req.params.id);
        res.json({ points });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des points de fidélité' });
    }
};

exports.addLoyaltyPoints = async (req, res) => {
    try {
        await Customer.addLoyaltyPoints(req.params.id, req.body.points);
        res.json({ message: 'Points de fidélité ajoutés avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout des points de fidélité' });
    }
};
