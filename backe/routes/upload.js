const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Filtrer les types de fichiers acceptés
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Seules les images sont acceptées.'));
  }
};

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = path.join(__dirname, '../uploads/products');
    fs.mkdirSync(uploadFolder, { recursive: true });
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const filename = uuidv4() + path.extname(file.originalname);
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Route pour télécharger une image de produit
router.post('/products/:productId', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier n\'a été uploadé' });
    }

    const { filename } = req.file;
    
    // Récupérer les informations du fichier
    const fileInfo = {
      filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    };

    res.status(200).json(fileInfo);
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route pour supprimer une image de produit
router.delete('/products/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/products', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: 'Image supprimée avec succès' });
    } else {
      res.status(404).json({ error: 'Image non trouvée' });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route pour servir les images de produits
router.get('/products/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/products', filename);

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: 'Image non trouvée' });
    }
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
