const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { createPromotion, getPromotionById, getActivePromotions, updatePromotion, deletePromotion, getPromotionHistory, getPromotionsByCategory, applyPromotion } = require('../controllers/promotionController');

// Routes pour les promotions
router.post('/', validate, createPromotion);
router.get('/:id', getPromotionById);
router.get('/active', getActivePromotions);
router.put('/:id', validate, updatePromotion);
router.delete('/:id', deletePromotion);
router.get('/history/:productId', getPromotionHistory);
router.get('/category/:categoryId', getPromotionsByCategory);
router.post('/:promotionId/apply', validate, applyPromotion);

module.exports = router;
