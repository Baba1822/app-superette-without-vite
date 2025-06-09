const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Récupérer tous les produits
router.get('/', async (req, res) => {
    try {
        const [products] = await pool.query(
            'SELECT p.*, c.nom as categorie_nom FROM produits p LEFT JOIN categories c ON p.categorie_id = c.id'
        );
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
});

// Récupérer un produit par ID
router.get('/:id', async (req, res) => {
    try {
        const [product] = await pool.query(
            'SELECT p.*, c.nom as categorie_nom FROM produits p LEFT JOIN categories c ON p.categorie_id = c.id WHERE p.id = ?',
            [req.params.id]
        );
        if (!product.length) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.json(product[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
    }
});

// Créer un nouveau produit (requiert authentification)
router.post('/', auth, async (req, res) => {
    try {
        const { nom, description, prix, stock, categorie_id } = req.body;
        const [result] = await pool.query(
            'INSERT INTO produits (nom, description, prix, stock, categorie_id) VALUES (?, ?, ?, ?, ?)',
            [nom, description, prix, stock, categorie_id]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
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
