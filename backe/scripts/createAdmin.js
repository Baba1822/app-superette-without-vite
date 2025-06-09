require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // Vérifier si l'admin existe déjà
        const [existingAdmin] = await connection.promise().query(
            'SELECT * FROM utilisateurs WHERE email = ? AND type = ?',
            ['admin@baba.com', 'admin']
        );

        if (existingAdmin.length > 0) {
            console.log('Un administrateur existe déjà avec cet email.');
            return;
        }

        // Hasher le mot de passe par défaut
        const password = 'Admin123';
        const hashedPassword = await bcrypt.hash(password, 8);

        // Créer l'administrateur
        const [result] = await connection.promise().query(
            'INSERT INTO utilisateurs (email, motdepasse, type, nom, prenom, telephone) VALUES (?, ?, ?, ?, ?, ?)',
            ['admin@baba.com', hashedPassword, 'admin', 'Administrateur', 'Baba', '625335960']
        );

        console.log('Administrateur créé avec succès !');
        console.log('Email: admin@baba.com');
        console.log('Mot de passe: Admin123');
        console.log('ID:', result.insertId);

        connection.end();
    } catch (error) {
        console.error('Erreur lors de la création de l\'administrateur:', error);
        throw error;
    }
}

createAdmin();
