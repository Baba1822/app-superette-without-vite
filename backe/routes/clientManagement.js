const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { 
    createCart, getCart, addItemToCart, updateCartItem, removeItemFromCart,
    getCartItems, getCartTotal, processCheckout, getCheckoutHistory,
    getCheckoutDetails, getClientLoyaltyStatus, getLoyaltyPointsHistory,
    redeemPoints, getLoyaltyRewards, applyLoyaltyDiscount
} = require('../controllers/clientManagementController');

// Routes pour la gestion des paniers
router.post('/cart', validate, createCart);
router.get('/cart/:clientId', getCart);
router.post('/cart/:cartId/add', validate, addItemToCart);
router.put('/cart/:cartId/update', validate, updateCartItem);
router.delete('/cart/:cartId/remove', validate, removeItemFromCart);
router.get('/cart/:cartId/items', getCartItems);
router.get('/cart/:cartId/total', getCartTotal);

// Routes pour la validation du panier
router.post('/checkout/:cartId', validate, processCheckout);
router.get('/checkout/history/:clientId', getCheckoutHistory);
router.get('/checkout/:orderId/details', getCheckoutDetails);

// Routes pour la gestion de la fidélité
router.get('/loyalty/:clientId/status', getClientLoyaltyStatus);
router.get('/loyalty/:clientId/history', getLoyaltyPointsHistory);
router.post('/loyalty/:clientId/redeem', validate, redeemPoints);
router.get('/loyalty/:clientId/rewards', getLoyaltyRewards);
router.post('/loyalty/rewards/:rewardId/apply', validate, applyLoyaltyDiscount);

module.exports = router;
