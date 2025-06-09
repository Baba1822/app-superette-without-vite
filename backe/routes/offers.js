const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { 
    createDiscount, getDiscountById, getActiveDiscounts, updateDiscount, 
    deleteDiscount, applyDiscount,
    createSeasonalOffer, getSeasonalOfferById, getActiveSeasonalOffers, 
    updateSeasonalOffer, deleteSeasonalOffer, applySeasonalOffer
} = require('../controllers/offerController');

// Routes pour les remises
router.post('/discounts', validate, createDiscount);
router.get('/discounts/:id', getDiscountById);
router.get('/discounts/active', getActiveDiscounts);
router.put('/discounts/:id', validate, updateDiscount);
router.delete('/discounts/:id', deleteDiscount);
router.post('/discounts/:discountId/apply', validate, applyDiscount);

// Routes pour les offres saisonnières
router.post('/seasonal', validate, createSeasonalOffer);
router.get('/seasonal/:id', getSeasonalOfferById);
router.get('/seasonal/active', getActiveSeasonalOffers);
router.put('/seasonal/:id', validate, updateSeasonalOffer);
router.delete('/seasonal/:id', deleteSeasonalOffer);
router.post('/seasonal/:offerId/apply', validate, applySeasonalOffer);

module.exports = router;
