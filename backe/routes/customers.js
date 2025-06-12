const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.getAll();
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.getById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Create new customer
router.post('/', async (req, res) => {
  try {
    const customerId = await Customer.create(req.body);
    res.status(201).json({ id: customerId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    await Customer.update(req.params.id, req.body);
    res.json({ message: 'Client mis à jour' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Update customer status
router.patch('/:id/status', async (req, res) => {
  try {
    await Customer.updateStatus(req.params.id, req.body.status);
    res.json({ message: 'Statut mis à jour' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get customer stats
router.get('/:id/stats', async (req, res) => {
  try {
    const stats = await Customer.getStats(req.params.id);
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    await Customer.delete(req.params.id);
    res.json({ message: 'Client supprimé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;