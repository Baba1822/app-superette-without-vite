const pool = require('../config/database');
const { validationResult } = require('express-validator');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/products');
    fs.mkdir(uploadDir, { recursive: true })
      .then(() => cb(null, uploadDir))
      .catch(err => cb(err));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Export the upload configuration
exports.upload = upload;

// Classe Product avec gestion des images
class Product {
  static async getAll(filters = {}) {
    let query = 'SELECT * FROM produits WHERE 1=1';
    const params = [];

    if (filters.categoryId) {
      query += ' AND categorie_id = ?';
      params.push(filters.categoryId);
    }

    if (filters.seasonalOnly) {
      query += ' AND saison = TRUE';
    }

    if (filters.promotionsOnly) {
      query += ' AND promotion = TRUE';
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM produits WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(productData) {
    const [result] = await pool.query('INSERT INTO produits SET ?', productData);
    return result.insertId;
  }

  static async update(id, productData) {
    await pool.query('UPDATE produits SET ? WHERE id = ?', [productData, id]);
  }

  static async delete(id) {
    await pool.query('DELETE FROM produits WHERE id = ?', [id]);
  }

  static async uploadImage(productId, imageFile) {
    // Mettre à jour le chemin de l'image dans la base de données
    const imagePath = path.join('/uploads/products', imageFile.filename);
    await pool.query('UPDATE produits SET image = ? WHERE id = ?', [imagePath, productId]);
    return imagePath;
  }

  static async getImagePath(productId) {
    const [rows] = await pool.query('SELECT image FROM produits WHERE id = ?', [productId]);
    if (rows[0]) {
      return rows[0].image;
    }
    return null;
  }
}

// Export the Product class
exports.Product = Product;

exports.getAllProducts = async (req, res) => {
  try {
    const filters = {
      categoryId: req.query.categoryId,
      seasonalOnly: req.query.seasonalOnly === 'true',
      promotionsOnly: req.query.promotionsOnly === 'true'
    };

    const products = await Product.getAll(filters);
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Erreur dans getAllProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des produits',
      error: error.message
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Erreur dans getProductById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du produit',
      error: error.message
    });
  }
};

exports.createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  try {
    const productId = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      productId: productId
    });
  } catch (error) {
    console.error('Erreur dans createProduct:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du produit',
      error: error.message
    });
  }
};

exports.updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    await Product.update(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Produit mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur dans updateProduct:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du produit',
      error: error.message
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de produit invalide'
      });
    }

    const product = await Product.getById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Vérifier si le produit est utilisé dans des commandes
    const [orders] = await pool.query(
      'SELECT COUNT(*) AS count FROM commande_details WHERE produit_id = ?',
      [productId]
    );

    if (orders[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer - produit utilisé dans des commandes'
      });
    }

    await Product.delete(productId);
    
    res.status(200).json({
      success: true,
      message: 'Produit supprimé avec succès',
      deletedId: productId
    });
  } catch (error) {
    console.error('Erreur dans deleteProduct:', error);
    
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer - produit référencé ailleurs'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du produit',
      error: error.message
    });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier image fourni'
      });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    await Product.update(req.params.id, { image: imagePath });

    res.json({
      success: true,
      message: 'Image téléchargée avec succès',
      imageUrl: imagePath
    });
  } catch (error) {
    console.error('Erreur dans uploadImage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du téléchargement de l\'image',
      error: error.message
    });
  }
};

exports.getPromotionalProducts = async (req, res) => {
  try {
    const products = await Product.getAll({ promotionsOnly: true });
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Erreur dans getPromotionalProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des promotions',
      error: error.message
    });
  }
};

exports.getSeasonalProducts = async (req, res) => {
  try {
    const products = await Product.getAll({ seasonalOnly: true });
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Erreur dans getSeasonalProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des produits saisonniers',
      error: error.message
    });
  }
};

exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;
    const [products] = await pool.query(
      'SELECT * FROM produits WHERE stock <= ?',
      [threshold]
    );
    res.json({
      success: true,
      data: products,
      count: products.length,
      threshold: threshold
    });
  } catch (error) {
    console.error('Erreur dans getLowStockProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des produits en stock faible',
      error: error.message
    });
  }
};