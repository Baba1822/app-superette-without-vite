const pool = require('../config/db');

class Cart {
    static async createCart(clientId) {
        const [result] = await pool.query(
            'INSERT INTO paniers (client_id, date_creation) VALUES (?, NOW())',
            [clientId]
        );
        return result.insertId;
    }

    static async getCartById(id) {
        const [cart] = await pool.query(
            'SELECT p.*, c.nom as client_nom ' +
            'FROM paniers p ' +
            'LEFT JOIN clients c ON p.client_id = c.id ' +
            'WHERE p.id = ?',
            [id]
        );
        return cart[0];
    }

    static async getCartByClientId(clientId) {
        const [cart] = await pool.query(
            'SELECT p.*, c.nom as client_nom ' +
            'FROM paniers p ' +
            'LEFT JOIN clients c ON p.client_id = c.id ' +
            'WHERE p.client_id = ? AND p.date_validation IS NULL ' +
            'ORDER BY p.date_creation DESC LIMIT 1',
            [clientId]
        );
        return cart[0];
    }

    static async addItemToCart(cartId, productId, quantity) {
        await pool.query(
            'INSERT INTO panier_items (panier_id, produit_id, quantite) ' +
            'VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantite = quantite + ?',
            [cartId, productId, quantity, quantity]
        );
    }

    static async updateCartItem(cartId, productId, quantity) {
        await pool.query(
            'UPDATE panier_items SET quantite = ? WHERE panier_id = ? AND produit_id = ?',
            [quantity, cartId, productId]
        );
    }

    static async removeItemFromCart(cartId, productId) {
        await pool.query(
            'DELETE FROM panier_items WHERE panier_id = ? AND produit_id = ?',
            [cartId, productId]
        );
    }

    static async getCartItems(cartId) {
        const [items] = await pool.query(
            'SELECT pi.*, p.nom as produit_nom, p.prix as prix_unitaire, ' +
            'p.image as produit_image, c.nom as categorie_nom ' +
            'FROM panier_items pi ' +
            'LEFT JOIN produits p ON pi.produit_id = p.id ' +
            'LEFT JOIN categories_produits c ON p.categorie_id = c.id ' +
            'WHERE pi.panier_id = ?',
            [cartId]
        );
        return items;
    }

    static async validateCart(cartId, paymentMethod, status = 'en_attente') {
        await pool.query(
            'UPDATE paniers SET date_validation = NOW(), ' +
            'methode_paiement = ?, statut = ? WHERE id = ?',
            [paymentMethod, status, cartId]
        );
    }

    static async getCartTotal(cartId) {
        const [total] = await pool.query(
            'SELECT SUM(pi.quantite * p.prix) as total ' +
            'FROM panier_items pi ' +
            'LEFT JOIN produits p ON pi.produit_id = p.id ' +
            'WHERE pi.panier_id = ?',
            [cartId]
        );
        return total[0]?.total || 0;
    }
}

module.exports = Cart;
