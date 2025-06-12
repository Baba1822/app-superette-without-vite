const Supplier = require('../models/Supplier');

exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.getAll();
        res.status(200).json({
            success: true,
            data: suppliers
        });
    } catch (error) {
        console.error('Error in getAllSuppliers:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des fournisseurs',
            error: error.message
        });
    }
};

exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.getById(req.params.id);
        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Fournisseur non trouvé'
            });
        }
        res.status(200).json({
            success: true,
            data: supplier
        });
    } catch (error) {
        console.error('Error in getSupplierById:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du fournisseur',
            error: error.message
        });
    }
};

exports.createSupplier = async (req, res) => {
    try {
        const { nom, telephone, email, adresse } = req.body;
        
        if (!nom || !telephone || !adresse) {
            return res.status(400).json({
                success: false,
                message: 'Nom, téléphone et adresse sont obligatoires'
            });
        }

        const supplierId = await Supplier.create({ nom, telephone, email, adresse });
        res.status(201).json({
            success: true,
            data: { id: supplierId }
        });
    } catch (error) {
        console.error('Error in createSupplier:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du fournisseur',
            error: error.message
        });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, telephone, email, adresse } = req.body;
        
        if (!nom || !telephone || !adresse) {
            return res.status(400).json({
                success: false,
                message: 'Nom, téléphone et adresse sont obligatoires'
            });
        }

        await Supplier.update(id, { nom, telephone, email, adresse });
        res.status(200).json({
            success: true,
            message: 'Fournisseur mis à jour avec succès'
        });
    } catch (error) {
        console.error('Error in updateSupplier:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du fournisseur',
            error: error.message
        });
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        await Supplier.delete(id);
        res.status(200).json({
            success: true,
            message: 'Fournisseur supprimé avec succès'
        });
    } catch (error) {
        console.error('Error in deleteSupplier:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du fournisseur',
            error: error.message
        });
    }
};

exports.searchSuppliers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Le paramètre de recherche est requis'
            });
        }

        const suppliers = await Supplier.search(q);
        res.status(200).json({
            success: true,
            data: suppliers
        });
    } catch (error) {
        console.error('Error in searchSuppliers:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la recherche des fournisseurs',
            error: error.message
        });
    }
};