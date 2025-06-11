const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { createClient, getClientById, getClients, updateClient, deleteClient, getPurchaseHistory, getLoyaltyPoints, addLoyaltyPoints, addAddress, getAddresses, updateAddress, deleteAddress, getClientPreferences, updateClientPreferences, getClientStatistics, getAllClients } = require('../controllers/clientController');

// Routes pour les clients
router.post('/', validate, createClient);
router.get('/', getAllClients);
router.get('/:id', getClientById);
router.get('/email/:email', getClients);
router.put('/:id', validate, updateClient);
router.delete('/:id', deleteClient);

// Historique des commandes
router.get('/:id/history', getPurchaseHistory);

// Points de fidélité
router.get('/:id/points', getLoyaltyPoints);
router.post('/:id/points', validate, addLoyaltyPoints);

// Adresses
router.post('/:clientId/addresses', validate, addAddress);
router.get('/:clientId/addresses', getAddresses);
router.put('/addresses/:addressId', validate, updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

// Préférences
router.get('/:clientId/preferences', getClientPreferences);
router.post('/:clientId/preferences', validate, updateClientPreferences);

// Statistiques
router.get('/:clientId/stats', getClientStatistics);

module.exports = router;
