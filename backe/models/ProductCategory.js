const pool = require('../config/db');

class ProductCategory {
    static async createCategory(categoryData) {
        const [result] = await pool.query(
            'INSERT INTO categories_produits (nom, description, image, parent_id) VALUES (?, ?, ?, ?)',
            [categoryData.nom, categoryData.description, categoryData.image, categoryData.parent_id]
        );
        return result.insertId;
    }

    static async getCategoryById(id) {
        const [categories] = await pool.query(
            'SELECT * FROM categories_produits WHERE id = ?',
            [id]
        );
        return categories[0];
    }

    static async getCategories(filters = {}) {
        let query = 'SELECT c.*, COUNT(p.id) as product_count FROM categories_produits c ' +
                   'LEFT JOIN produits p ON c.id = p.categorie_id';
        const params = [];

        if (filters.parentId) {
            query += ' WHERE c.parent_id = ?';
            params.push(filters.parentId);
        }

        query += ' GROUP BY c.id ORDER BY c.nom ASC';

        const [categories] = await pool.query(query, params);
        return categories;
    }

    static async updateCategory(id, categoryData) {
        await pool.query(
            'UPDATE categories_produits SET nom = ?, description = ?, image = ?, parent_id = ? WHERE id = ?',
            [categoryData.nom, categoryData.description, categoryData.image, categoryData.parent_id, id]
        );
    }

    static async deleteCategory(id) {
        // Supprimer d'abord les sous-catégories
        await pool.query(
            'DELETE FROM categories_produits WHERE parent_id = ?',
            [id]
        );
        
        // Supprimer la catégorie
        await pool.query(
            'DELETE FROM categories_produits WHERE id = ?',
            [id]
        );
    }

    static async getProductsByCategory(categoryId) {
        const [products] = await pool.query(
            'SELECT p.*, c.nom as categorie_nom FROM produits p ' +
            'LEFT JOIN categories_produits c ON p.categorie_id = c.id ' +
            'WHERE p.categorie_id = ? ORDER BY p.nom ASC',
            [categoryId]
        );
        return products;
    }

    static async getCategoryHierarchy() {
        const [categories] = await pool.query(
            'SELECT c1.*, c2.nom as parent_nom ' +
            'FROM categories_produits c1 ' +
            'LEFT JOIN categories_produits c2 ON c1.parent_id = c2.id ' +
            'ORDER BY c1.nom ASC'
        );
        return categories;
    }
}

module.exports = ProductCategory;
