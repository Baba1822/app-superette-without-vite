const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const filters = {
      isSeasonal: req.query.seasonalOnly === 'true',
      hasPromotion: req.query.promotionsOnly === 'true',
      categoryId: req.query.categoryId,
      search: req.query.search
    };
    
    const products = await Product.getAll(filters);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    // Validation des données
    if (!req.body.nom || !req.body.prix || !req.body.stock) {
      return res.status(400).json({ error: 'Nom, prix et stock sont requis' });
    }

    const productId = await Product.create(req.body);
    res.status(201).json({ id: productId });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    // Validation des données
    if (!req.body.nom || !req.body.prix || !req.body.stock) {
      return res.status(400).json({ error: 'Nom, prix et stock sont requis' });
    }

    await Product.update(req.params.id, req.body);
    res.json({ message: 'Produit mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.delete(req.params.id);
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    // Mettre à jour le produit avec le chemin de l'image
    const imagePath = `/uploads/${req.file.filename}`;
    await Product.update(req.params.id, { image: imagePath });

    res.json({ imageUrl: imagePath });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'upload de l\'image' });
  }
};

exports.getPromotionalProducts = async (req, res) => {
  try {
    const products = await Product.getPromotionalProducts(true);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des promotions' });
  }
};

exports.getSeasonalProducts = async (req, res) => {
  try {
    const products = await Product.getSeasonalProducts(true);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits saisonniers' });
  }
};

exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.getLowStockProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits avec stock faible' });
  }
};