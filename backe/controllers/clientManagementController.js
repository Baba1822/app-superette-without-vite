const Cart = require('../models/Cart');
const Checkout = require('../models/Checkout');
const LoyaltyStatus = require('../models/LoyaltyStatus');
const { validate } = require('../utils/validators');

// Gestion des paniers
exports.createCart = async (req, res) => {
    try {
        const cartId = await Cart.createCart(req.body.clientId);
        res.status(201).json({ id: cartId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du panier' });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.getCartByClientId(req.params.clientId);
        if (!cart) {
            return res.status(404).json({ error: 'Panier non trouvé' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du panier' });
    }
};

exports.addItemToCart = async (req, res) => {
    try {
        await Cart.addItemToCart(req.params.cartId, req.body.productId, req.body.quantity);
        res.json({ message: 'Produit ajouté au panier avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout du produit au panier' });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        await Cart.updateCartItem(req.params.cartId, req.body.productId, req.body.quantity);
        res.json({ message: 'Quantité mise à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la quantité' });
    }
};

exports.removeItemFromCart = async (req, res) => {
    try {
        await Cart.removeItemFromCart(req.params.cartId, req.body.productId);
        res.json({ message: 'Produit supprimé du panier avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
    }
};

exports.getCartItems = async (req, res) => {
    try {
        const items = await Cart.getCartItems(req.params.cartId);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des éléments du panier' });
    }
};

exports.getCartTotal = async (req, res) => {
    try {
        const total = await Cart.getCartTotal(req.params.cartId);
        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors du calcul du total' });
    }
};

// Gestion de la validation du panier
exports.processCheckout = async (req, res) => {
    try {
        const orderId = await Checkout.processCheckout(req.params.cartId, req.body);
        res.status(201).json({ orderId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCheckoutHistory = async (req, res) => {
    try {
        const history = await Checkout.getCheckoutHistory(req.params.clientId);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
    }
};

exports.getCheckoutDetails = async (req, res) => {
    try {
        const details = await Checkout.getCheckoutDetails(req.params.orderId);
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des détails' });
    }
};

// Gestion de la fidélité
exports.getClientLoyaltyStatus = async (req, res) => {
    try {
        const status = await LoyaltyStatus.getClientLoyaltyStatus(req.params.clientId);
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du statut de fidélité' });
    }
};

exports.getLoyaltyPointsHistory = async (req, res) => {
    try {
        const history = await LoyaltyStatus.getLoyaltyPointsHistory(req.params.clientId);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique des points' });
    }
};

exports.redeemPoints = async (req, res) => {
    try {
        const result = await LoyaltyStatus.redeemPoints(req.params.clientId, req.body.points);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getLoyaltyRewards = async (req, res) => {
    try {
        const rewards = await LoyaltyStatus.getLoyaltyRewards(req.params.clientId);
        res.json(rewards);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des récompenses' });
    }
};

exports.applyLoyaltyDiscount = async (req, res) => {
    try {
        const discount = await LoyaltyStatus.applyLoyaltyDiscount(req.params.rewardId, req.body.cartId);
        res.json(discount);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
