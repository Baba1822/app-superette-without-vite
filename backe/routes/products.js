const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');

// Récupérer tous les produits
router.get('/', async (req, res) => {
    try {
        const filters = {};
        if (req.query.categoryId) {
            filters.categoryId = parseInt(req.query.categoryId);
        }
        if (req.query.search) {
            filters.search = req.query.search;
        }
        
        const products = await Product.getAll(filters);
        res.json(products);
    } catch (error) {
        console.error('Erreur dans la route GET /products:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
});

// Récupérer un produit par ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.json(product);
    } catch (error) {
        console.error('Erreur dans la route GET /products/:id:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
    }
});

// Créer un nouveau produit (requiert authentification)
router.post('/', auth, async (req, res) => {
    try {
        const productId = await Product.create(req.body);
        res.status(201).json({ id: productId });
    } catch (error) {
        console.error('Erreur dans la route POST /products:', error);
        res.status(500).json({ error: 'Erreur lors de la création du produit' });
    }
});

// Mettre à jour un produit (requiert authentification)
router.put('/:id', auth, async (req, res) => {
    try {
        const { nom, description, prix, stock, categorie_id } = req.body;
        await pool.query(
            'UPDATE produits SET nom = ?, description = ?, prix = ?, stock = ?, categorie_id = ? WHERE id = ?',
            [nom, description, prix, stock, categorie_id, req.params.id]
        );
        res.json({ message: 'Produit mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
    }
});

// Supprimer un produit (requiert authentification)
router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM produits WHERE id = ?', [req.params.id]);
        res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
    }
});

module.exports = router;
