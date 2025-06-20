const Courier = require('../models/Courier');

exports.getAllCouriers = async (req, res) => {
  try {
    const couriers = await Courier.getAll();
    res.json(couriers);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des livreurs' });
  }
};

exports.getCourierById = async (req, res) => {
  try {
    const courier = await Courier.getById(req.params.id);
    if (!courier) return res.status(404).json({ error: 'Livreur non trouvé' });
    res.json(courier);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du livreur' });
  }
};

exports.createCourier = async (req, res) => {
  try {
    const courier = await Courier.create(req.body);
    res.status(201).json(courier);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du livreur' });
  }
};

exports.updateCourier = async (req, res) => {
  try {
    const courier = await Courier.update(req.params.id, req.body);
    res.json(courier);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du livreur' });
  }
};

exports.deleteCourier = async (req, res) => {
  try {
    await Courier.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du livreur' });
  }
};

exports.getCourierHistory = async (req, res) => {
  try {
    const history = await Courier.getHistory(req.params.id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique du livreur' });
  }
}; 