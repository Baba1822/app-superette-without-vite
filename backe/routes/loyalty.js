const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyController');
const auth = require('../middleware/auth');

// Middleware pour logger les requêtes (optionnel, pour déboguer)
router.use((req, res, next) => {
    console.log(`Loyalty API: ${req.method} ${req.path}`, req.params, req.query);
    next();
});

// Cartes de fidélité
router.get('/cards/:clientId', loyaltyController.getClientLoyalty);
router.post('/cards', loyaltyController.createLoyaltyCard);
router.put('/cards/:cardId', loyaltyController.updateLoyaltyCard);
router.delete('/cards/:cardId', loyaltyController.deleteLoyaltyCard);

// Points
router.post('/cards/:clientId/points', loyaltyController.addPoints);
router.get('/cards/:clientId/history', loyaltyController.getPointsHistory);

// Niveau de fidélité
router.get('/cards/:clientId/tier', loyaltyController.checkLoyaltyTier);

// Récompenses
router.get('/rewards', loyaltyController.getAvailableRewards);
router.post('/cards/:clientId/redeem', loyaltyController.redeemReward);
router.get('/rewards/:rewardId/availability', loyaltyController.checkRewardAvailability);

// Statistiques
router.get('/stats', loyaltyController.getLoyaltyStats);

module.exports = router;