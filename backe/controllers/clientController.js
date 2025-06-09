const Client = require('../models/Client');
const { validate } = require('../utils/validators');

exports.createClient = async (req, res) => {
    try {
        const clientId = await Client.createClient(req.body);
        res.status(201).json({ id: clientId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du client' });
    }
};

exports.getClientById = async (req, res) => {
    try {
        const client = await Client.getClientById(req.params.id);
        if (!client) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du client' });
    }
};

exports.getClients = async (req, res) => {
    try {
        const clients = await Client.getClients(req.query);
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des clients' });
    }
};

exports.updateClient = async (req, res) => {
    try {
        await Client.updateClient(req.params.id, req.body);
        res.json({ message: 'Client mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du client' });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        await Client.deleteClient(req.params.id);
        res.json({ message: 'Client supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du client' });
    }
};

exports.addAddress = async (req, res) => {
    try {
        const addressId = await Client.addAddress(req.params.clientId, req.body);
        res.status(201).json({ id: addressId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'adresse' });
    }
};

exports.getAddresses = async (req, res) => {
    try {
        const addresses = await Client.getAddresses(req.params.clientId);
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des adresses' });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        await Client.updateAddress(req.params.addressId, req.body);
        res.json({ message: 'Adresse mise à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'adresse' });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        await Client.deleteAddress(req.params.addressId);
        res.json({ message: 'Adresse supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'adresse' });
    }
};

exports.getPurchaseHistory = async (req, res) => {
    try {
        const history = await Client.getPurchaseHistory(req.params.clientId, req.query);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
    }
};

exports.getLoyaltyPoints = async (req, res) => {
    try {
        const points = await Client.getLoyaltyPoints(req.params.clientId);
        res.json(points);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des points' });
    }
};

exports.addLoyaltyPoints = async (req, res) => {
    try {
        const pointsId = await Client.addLoyaltyPoints(req.params.clientId, req.body);
        res.status(201).json({ id: pointsId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout des points' });
    }
};

exports.getClientPreferences = async (req, res) => {
    try {
        const preferences = await Client.getClientPreferences(req.params.clientId);
        res.json(preferences);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des préférences' });
    }
};

exports.updateClientPreferences = async (req, res) => {
    try {
        await Client.updateClientPreferences(req.params.clientId, req.body);
        res.json({ message: 'Préférences mises à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour des préférences' });
    }
};

exports.getClientStatistics = async (req, res) => {
    try {
        const stats = await Client.getClientStatistics(req.params.clientId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
};
