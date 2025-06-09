const Supplier = require('../models/Supplier');
const { validate } = require('../utils/validators');

exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.getAll();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des fournisseurs' });
    }
};

exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.getById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ error: 'Fournisseur non trouvé' });
        }
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du fournisseur' });
    }
};

exports.createSupplier = async (req, res) => {
    try {
        const supplierId = await Supplier.create(req.body);
        res.status(201).json({ id: supplierId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du fournisseur' });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        await Supplier.update(req.params.id, req.body);
        res.json({ message: 'Fournisseur mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du fournisseur' });
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        await Supplier.delete(req.params.id);
        res.json({ message: 'Fournisseur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du fournisseur' });
    }
};

exports.searchSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.search(req.query.q);
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la recherche des fournisseurs' });
    }
};
