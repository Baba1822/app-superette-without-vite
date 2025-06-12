const Customer = require('../models/Customer');

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.getAll();
    res.json(customers);
  } catch (error) {
    console.error('Error getting all customers:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des clients',
      details: error.message 
    });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const customerId = await Customer.create(req.body);
    res.status(201).json({ id: customerId });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création du client',
      details: error.message 
    });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.getById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Error getting customer by ID:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération du client',
      details: error.message 
    });
  }
};

exports.getCustomerByEmail = async (req, res) => {
  try {
    const customer = await Customer.getByEmail(req.params.email);
    if (!customer) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Error getting customer by email:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération du client',
      details: error.message 
    });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    await Customer.update(req.params.id, req.body);
    res.json({ message: 'Client mis à jour avec succès' });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la mise à jour du client',
      details: error.message 
    });
  }
};

exports.updateCustomerStatus = async (req, res) => {
  try {
    await Customer.updateStatus(req.params.id, req.body.status);
    res.json({ message: 'Statut du client mis à jour avec succès' });
  } catch (error) {
    console.error('Error updating customer status:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la mise à jour du statut',
      details: error.message 
    });
  }
};

exports.getPurchaseHistory = async (req, res) => {
  try {
    const history = await Customer.getPurchaseHistory(req.params.id);
    res.json(history);
  } catch (error) {
    console.error('Error getting purchase history:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération de l\'historique',
      details: error.message 
    });
  }
};

exports.getLoyaltyPoints = async (req, res) => {
  try {
    const points = await Customer.getLoyaltyPoints(req.params.id);
    res.json({ points });
  } catch (error) {
    console.error('Error getting loyalty points:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des points de fidélité',
      details: error.message 
    });
  }
};

exports.addLoyaltyPoints = async (req, res) => {
  try {
    await Customer.addLoyaltyPoints(req.params.id, req.body.points);
    res.json({ message: 'Points de fidélité ajoutés avec succès' });
  } catch (error) {
    console.error('Error adding loyalty points:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'ajout des points de fidélité',
      details: error.message 
    });
  }
};

exports.getCustomerStats = async (req, res) => {
  try {
    const stats = await Customer.getStats(req.params.id);
    res.json(stats);
  } catch (error) {
    console.error('Error getting customer stats:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des statistiques',
      details: error.message 
    });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.delete(req.params.id);
    res.json({ message: 'Client supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression du client',
      details: error.message 
    });
  }
};