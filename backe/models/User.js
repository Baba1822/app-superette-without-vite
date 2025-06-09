const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async findByEmail(email) {
        const [users] = await pool.query(
            'SELECT * FROM utilisateurs WHERE email = ?',
            [email]
        );
        return users[0];
    }

    static async create(userData) {
        try {
            // Vérifications de base
            if (!userData.email || !userData.motdepasse) {
                throw new Error('Email et motdepasse sont requis');
            }

            console.log('Données utilisateur à créer:', userData);
            
            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(userData.motdepasse, 8);
            console.log('Mot de passe hashé:', hashedPassword);

            const query = 'INSERT INTO utilisateurs (email, motdepasse, type, nom, prenom, telephone) VALUES (?, ?, ?, ?, ?, ?)';
            
            const params = [
                userData.email.toLowerCase(),
                hashedPassword,
                userData.type || 'client',
                userData.nom || '',
                userData.prenom || '',
                userData.telephone || ''
            ];

            const [result] = await pool.query(query, params);
            return result.insertId;
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            throw error;
        }
    }

    static async verifyPassword(user, motdepasse) {
        return bcrypt.compare(motdepasse, user.motdepasse);
    }

    static async getById(id) {
        const [users] = await pool.query(
            'SELECT * FROM utilisateurs WHERE id = ?',
            [id]
        );
        return users[0];
    }

    static async update(id, userData) {
        await pool.query(
            'UPDATE utilisateurs SET nom = ?, prenom = ?, email = ? WHERE id = ?',
            [userData.nom, userData.prenom, userData.email, id]
        );
    }

    static async updatePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 8);
        await pool.query(
            'UPDATE utilisateurs SET motdepasse = ? WHERE id = ?',
            [hashedPassword, id]
        );
    }
}

module.exports = User;
