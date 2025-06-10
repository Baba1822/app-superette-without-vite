const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getUsers, getUserById, updateUser, deleteUser, getUserStats } = require('../controllers/userController');

// Routes protégées par authentification
router.use(protect);

// Récupérer tous les utilisateurs (admin)
router.get('/', protect, getUsers);

// Récupérer un utilisateur par ID
router.get('/:id', protect, getUserById);

// Mettre à jour un utilisateur
router.put('/:id', protect, updateUser);

// Supprimer un utilisateur (admin)
router.delete('/:id', protect, deleteUser);

// Récupérer les statistiques d'un utilisateur
router.get('/:id/stats', protect, getUserStats);

module.exports = router;
