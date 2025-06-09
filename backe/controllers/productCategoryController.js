const ProductCategory = require('../models/ProductCategory');
const { validate } = require('../utils/validators');

exports.createCategory = async (req, res) => {
    try {
        const categoryId = await ProductCategory.createCategory(req.body);
        res.status(201).json({ id: categoryId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la catégorie' });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await ProductCategory.getCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Catégorie non trouvée' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la catégorie' });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await ProductCategory.getCategories(req.query);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        await ProductCategory.updateCategory(req.params.id, req.body);
        res.json({ message: 'Catégorie mise à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la catégorie' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await ProductCategory.deleteCategory(req.params.id);
        res.json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la catégorie' });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const products = await ProductCategory.getProductsByCategory(req.params.categoryId);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
};

exports.getCategoryHierarchy = async (req, res) => {
    try {
        const hierarchy = await ProductCategory.getCategoryHierarchy();
        res.json(hierarchy);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la hiérarchie' });
    }
};
