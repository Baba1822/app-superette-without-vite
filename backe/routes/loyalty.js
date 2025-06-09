const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Créer une nouvelle carte de fidélité
router.post('/', auth, async (req, res) => {
    try {
        const { clientId, points = 0 } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO cartes_fidelite (client_id, points) VALUES (?, ?)',
            [clientId, points]
        );

        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la carte de fidélité' });
    }
});

// Récupérer la carte de fidélité d'un client
router.get('/:clientId', auth, async (req, res) => {
    try {
        const [card] = await pool.query(
            'SELECT * FROM cartes_fidelite WHERE client_id = ?',
            [req.params.clientId]
        );

        if (!card.length) {
            return res.status(404).json({ error: 'Carte de fidélité non trouvée' });
        }

        res.json(card[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la carte de fidélité' });
    }
});

// Ajouter des points à une carte
router.put('/:clientId/points', auth, async (req, res) => {
    try {
        const { points } = req.body;
        await pool.query(
            'UPDATE cartes_fidelite SET points = points + ? WHERE client_id = ?',
            [points, req.params.clientId]
        );
        res.json({ message: 'Points ajoutés avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout des points' });
    }
});

// Récupérer l'historique des points
router.get('/:clientId/history', auth, async (req, res) => {
    try {
        const [history] = await pool.query(
            'SELECT * FROM points_history WHERE client_id = ? ORDER BY created_at DESC',
            [req.params.clientId]
        );
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
    }
});

module.exports = router;
