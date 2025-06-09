const pool = require('../config/db');

class Product {
    static async getAll(filters = {}) {
        try {
            // Construire la requête avec des paramètres sécurisés
            let query = `
                SELECT 
                    p.*, 
                    c.nom as categorie_nom, 
                    c.description as categorie_description 
                FROM produits p 
                LEFT JOIN categories_produits c ON p.categorie_id = c.id`;
            const params = [];
            let whereClause = '';

            // Ajouter les filtres
            if (filters.categoryId) {
                params.push(filters.categoryId);
                whereClause += ` ${whereClause ? 'AND' : 'WHERE'} p.categorie_id = ?`;
            }

            if (filters.search) {
                params.push(`%${filters.search}%`, `%${filters.search}%`);
                whereClause += ` ${whereClause ? 'AND' : 'WHERE'} (p.nom LIKE ? OR p.description LIKE ?)`;
            }

            // Ajouter la clause WHERE si nécessaire
            if (whereClause) {
                query += whereClause;
            }

            // Ajouter l'ordre
            query += ' ORDER BY p.nom ASC';

            // Exécuter la requête
            const [products] = await pool.query(query, params);
            return products;
        } catch (error) {
            console.error('Erreur dans getAll:', error);
            throw error;
        }
    }

    static async getById(id) {
        const [products] = await pool.query(
            'SELECT p.*, c.nom as categorie_nom, c.description as categorie_description, c.image as categorie_image ' +
            'FROM produits p LEFT JOIN categories_produits c ON p.categorie_id = c.id ' +
            'WHERE p.id = ?',
            [id]
        );
        return products[0];
    }

    static async create(productData) {
        const [result] = await pool.query(
            'INSERT INTO produits (nom, description, prix, prix_promo, prix_grossiste, stock, stock_min, categorie_id, image, code_barre, ' +
            'date_peremption, fournisseur_id, etat, poids, unite_mesure) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [productData.nom, productData.description, productData.prix, productData.prix_promo, productData.prix_grossiste,
             productData.stock, productData.stock_min, productData.categorie_id, productData.image, productData.code_barre,
             productData.date_peremption, productData.fournisseur_id, productData.etat, productData.poids, productData.unite_mesure]
        );
        return result.insertId;
    }

    static async update(id, productData) {
        await pool.query(
            'UPDATE produits SET nom = ?, description = ?, prix = ?, prix_promo = ?, prix_grossiste = ?, stock = ?, ' +
            'stock_min = ?, categorie_id = ?, image = ?, code_barre = ?, date_peremption = ?, fournisseur_id = ?, ' +
            'etat = ?, poids = ?, unite_mesure = ? WHERE id = ?',
            [productData.nom, productData.description, productData.prix, productData.prix_promo, productData.prix_grossiste,
             productData.stock, productData.stock_min, productData.categorie_id, productData.image, productData.code_barre,
             productData.date_peremption, productData.fournisseur_id, productData.etat, productData.poids, productData.unite_mesure,
             id]
        );
    }

    static async delete(id) {
        // Mettre à jour les mouvements de stock liés
        await pool.query(
            'UPDATE mouvements_stock SET produit_id = NULL WHERE produit_id = ?',
            [id]
        );
        
        // Supprimer le produit
        await pool.query('DELETE FROM produits WHERE id = ?', [id]);
    }

    static async findByCategory(categoryId) {
        const [products] = await pool.query(
            'SELECT p.*, c.nom as categorie_nom FROM produits p ' +
            'LEFT JOIN categories_produits c ON p.categorie_id = c.id ' +
            'WHERE p.categorie_id = ? ORDER BY p.nom ASC',
            [categoryId]
        );
        return products;
    }

    static async getLowStockProducts() {
        const [products] = await pool.query(
            'SELECT p.*, c.nom as categorie_nom FROM produits p ' +
            'LEFT JOIN categories_produits c ON p.categorie_id = c.id ' +
            'WHERE p.stock <= p.stock_min ORDER BY p.stock ASC'
        );
        return products;
    }

    static async getExpiredProducts() {
        const [products] = await pool.query(
            'SELECT p.*, c.nom as categorie_nom FROM produits p ' +
            'LEFT JOIN categories_produits c ON p.categorie_id = c.id ' +
            'WHERE p.date_peremption <= CURDATE() ORDER BY p.date_peremption ASC'
        );
        return products;
    }

    static async getProductsBySupplier(supplierId) {
        const [products] = await pool.query(
            'SELECT p.*, c.nom as categorie_nom FROM produits p ' +
            'LEFT JOIN categories_produits c ON p.categorie_id = c.id ' +
            'WHERE p.fournisseur_id = ? ORDER BY p.nom ASC',
            [supplierId]
        );
        return products;
    }

    static async getProductHistory(productId) {
        const [history] = await pool.query(
            'SELECT m.*, u.nom as utilisateur_nom, p.nom as produit_nom ' +
            'FROM mouvements_stock m ' +
            'LEFT JOIN utilisateurs u ON m.utilisateur_id = u.id ' +
            'LEFT JOIN produits p ON m.produit_id = p.id ' +
            'WHERE m.produit_id = ? ORDER BY m.date_mouvement DESC',
            [productId]
        );
        return history;
    }

    static async updateStock(productId, quantity, movementType, userId) {
        // Mettre à jour le stock
        await pool.query(
            'UPDATE produits SET stock = stock + ? WHERE id = ?',
            [quantity, productId]
        );

        // Créer un mouvement de stock
        await pool.query(
            'INSERT INTO mouvements_stock (produit_id, type_mouvement, quantite, utilisateur_id, date_mouvement) ' +
            'VALUES (?, ?, ?, ?, NOW())',
            [productId, movementType, quantity, userId]
        );
    }
}

module.exports = Product;
