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

            if (filters.isSeasonal !== undefined) {
                params.push(filters.isSeasonal);
                whereClause += ` ${whereClause ? 'AND' : 'WHERE'} p.isSeasonal = ?`;
            }

            if (filters.hasPromotion !== undefined) {
                params.push(filters.hasPromotion);
                whereClause += ` ${whereClause ? 'AND' : 'WHERE'} p.hasPromotion = ?`;
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
        try {
            // D'abord récupérer le produit
            const [products] = await pool.query(
                'SELECT * FROM produits WHERE id = ?',
                [id]
            );
            const product = products[0];
            
            if (!product) {
                return null;
            }

            // Ensuite récupérer la catégorie
            const [categories] = await pool.query(
                'SELECT nom, description FROM categories_produits WHERE id = ?',
                [product.categorie_id]
            );
            const category = categories[0];

            // Combiner les résultats
            const result = {
                ...product,
                categorie_nom: category?.nom,
                categorie_description: category?.description
            };

            // Ajouter une image par défaut
            result.categorie_image = 'default-category.jpg';

            return result;
        } catch (error) {
            console.error('Erreur dans getById:', error);
            throw error;
        }
    }

    static async create(productData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Insérer le produit
            const [result] = await connection.query(
                'INSERT INTO produits (nom, categorie_id, prix, stock, description, stock_min, image_url, ' +
                'saison, date_debut_saison, date_fin_saison, promotion, type_promotion, valeur_promotion, ' +
                'date_debut_promo, date_fin_promo, date_peremption) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    productData.nom, 
                    productData.categorie_id, 
                    productData.prix, 
                    productData.stock,
                    productData.description,
                    productData.stock_min || 0,
                    productData.image_url || 'default-product.jpg',
                    productData.saison || false,
                    productData.date_debut_saison,
                    productData.date_fin_saison,
                    productData.promotion || false,
                    productData.type_promotion,
                    productData.valeur_promotion,
                    productData.date_debut_promo,
                    productData.date_fin_promo,
                    productData.date_peremption
                ]
            );

            const productId = result.insertId;

            // Récupérer un utilisateur admin
            const [adminUsers] = await connection.query(
                'SELECT id FROM utilisateurs WHERE type = "admin" LIMIT 1'
            );

            if (adminUsers.length === 0) {
                throw new Error('Aucun utilisateur administrateur trouvé pour enregistrer le mouvement de stock');
            }

            const adminId = adminUsers[0].id;

            // Créer un mouvement de stock initial si le stock est positif
            if (productData.stock > 0) {
                await connection.query(
                    'INSERT INTO mouvements_stock (produit_id, type_mouvement, quantite, date_mouvement, utilisateur_id) VALUES (?, ?, ?, NOW(), ?)',
                    [productId, 'initial', productData.stock, adminId]
                );
            }

            await connection.commit();
            return productId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(id) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Supprimer d'abord les mouvements de stock associés
            await connection.query(
                'DELETE FROM mouvements_stock WHERE produit_id = ?',
                [id]
            );
            
            // Ensuite supprimer le produit
            await connection.query(
                'DELETE FROM produits WHERE id = ?',
                [id]
            );

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(id, productData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Récupérer l'ancien stock
            const [oldProduct] = await connection.query(
                'SELECT stock FROM produits WHERE id = ?',
                [id]
            );

            // Calculer la différence de stock
            const stockDiff = productData.stock - (oldProduct[0]?.stock || 0);

            // Mettre à jour le produit
            await connection.query(
                'UPDATE produits SET nom = ?, categorie_id = ?, prix = ?, stock = ?, description = ?, ' +
                'stock_min = ?, image_url = ?, saison = ?, date_debut_saison = ?, date_fin_saison = ?, ' +
                'promotion = ?, type_promotion = ?, valeur_promotion = ?, date_debut_promo = ?, ' +
                'date_fin_promo = ?, date_peremption = ? WHERE id = ?',
                [
                    productData.nom,
                    productData.categorie_id,
                    productData.prix,
                    productData.stock,
                    productData.description,
                    productData.stock_min,
                    productData.image_url,
                    productData.saison,
                    productData.date_debut_saison,
                    productData.date_fin_saison,
                    productData.promotion,
                    productData.type_promotion,
                    productData.valeur_promotion,
                    productData.date_debut_promo,
                    productData.date_fin_promo,
                    productData.date_peremption,
                    id
                ]
            );

            // Créer un mouvement de stock si le stock a changé
            if (stockDiff !== 0) {
                await connection.query(
                    'INSERT INTO mouvements_stock (produit_id, type_mouvement, quantite, date_mouvement) VALUES (?, ?, ?, NOW())',
                    [id, stockDiff > 0 ? 'ajustement_positif' : 'ajustement_negatif', Math.abs(stockDiff)]
                );
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async findByCategory(categoryId) {
        const [products] = await pool.query(
            'SELECT p.*, c.nom as categorie_nom FROM produits p ' +
            'LEFT JOIN categories_produits c ON p.category = c.id ' +
            'WHERE p.category = ? ORDER BY p.name ASC',
            [categoryId]
        );
        return products;
    }

    static async getLowStockProducts() {
        const [products] = await pool.query(
            'SELECT p.*, c.nom as categorie_nom FROM produits p ' +
            'LEFT JOIN categories_produits c ON p.category = c.id ' +
            'WHERE p.quantity <= p.alertThreshold ORDER BY p.quantity ASC'
        );
        return products;
    }

    static async getExpiredProducts() {
        const [products] = await pool.query(
            'SELECT p.*, c.nom as categorie_nom FROM produits p ' +
            'LEFT JOIN categories_produits c ON p.category = c.id ' +
            'WHERE p.datePeremption <= CURDATE() ORDER BY p.datePeremption ASC'
        );
        return products;
    }

    static async getSeasonalProducts(isActive = true) {
        let query = `
            SELECT p.*, c.nom as categorie_nom FROM produits p 
            LEFT JOIN categories_produits c ON p.category = c.id 
            WHERE p.isSeasonal = true`;
        
        if (isActive) {
            query += ` AND CURDATE() BETWEEN p.seasonStart AND p.seasonEnd`;
        }
        
        query += ` ORDER BY p.name ASC`;
        
        const [products] = await pool.query(query);
        return products;
    }

    static async getPromotionalProducts(isActive = true) {
        let query = `
            SELECT p.*, c.nom as categorie_nom FROM produits p 
            LEFT JOIN categories_produits c ON p.category = c.id 
            WHERE p.hasPromotion = true`;
        
        if (isActive) {
            query += ` AND CURDATE() BETWEEN p.promotionStart AND p.promotionEnd`;
        }
        
        query += ` ORDER BY p.name ASC`;
        
        const [products] = await pool.query(query);
        return products;
    }

    static async getProductHistory(productId) {
        const [history] = await pool.query(
            'SELECT m.*, u.nom as utilisateur_nom, p.name as produit_nom ' +
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
            'UPDATE produits SET quantity = quantity + ? WHERE id = ?',
            [quantity, productId]
        );

        // Créer un mouvement de stock
        await pool.query(
            'INSERT INTO mouvements_stock (produit_id, type_mouvement, quantite, utilisateur_id, date_mouvement) ' +
            'VALUES (?, ?, ?, ?, NOW())',
            [productId, movementType, quantity, userId]
        );
    }

    static async getPromotionPrice(productId) {
        const [product] = await pool.query(
            'SELECT price, hasPromotion, promotionType, promotionValue, promotionStart, promotionEnd ' +
            'FROM produits WHERE id = ?',
            [productId]
        );

        if (!product[0] || !product[0].hasPromotion) {
            return product[0]?.price || 0;
        }

        const now = new Date();
        const promotionStart = new Date(product[0].promotionStart);
        const promotionEnd = new Date(product[0].promotionEnd);

        // Vérifier si la promotion est active
        if (now < promotionStart || now > promotionEnd) {
            return product[0].price;
        }

        const basePrice = product[0].price;
        const promotionValue = product[0].promotionValue;

        switch (product[0].promotionType) {
            case 'percentage':
                return basePrice * (1 - promotionValue / 100);
            case 'fixed':
                return Math.max(0, basePrice - promotionValue);
            default:
                return basePrice;
        }
    }

    static async getProductsNearExpiration(days = 7) {
        const [products] = await pool.query(
            'SELECT p.*, c.nom as categorie_nom FROM produits p ' +
            'LEFT JOIN categories_produits c ON p.category = c.id ' +
            'WHERE p.datePeremption BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY) ' +
            'ORDER BY p.datePeremption ASC',
            [days]
        );
        return products;
    }
}

module.exports = Product;