const mysql = require('mysql2');
const fs = require('fs').promises;
const pool = require('../config/database');

async function initializeDatabase() {
    try {
        console.log('Configuration de la connexion MySQL:');
        console.log('Host:', process.env.DB_HOST);
        console.log('User:', process.env.DB_USER);
        console.log('Password:', process.env.DB_PASSWORD ? '****' : 'empty');
        
        // Connexion à MySQL
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log('Connexion à MySQL réussie');

        // Créer la base de données si elle n'existe pas
        await connection.promise().query('CREATE DATABASE IF NOT EXISTS baba');
        console.log('Base de données Baba créée avec succès');

        // Utiliser la base de données
        await connection.promise().query('USE Baba');
        console.log('Base de données Baba sélectionnée');

        // Lire les fichiers de migration
        const migrations = [
            './migrations/001_initial_schema.sql',
            './migrations/002_remove_role_column.sql'
        ];

        for (const migration of migrations) {
            console.log(`\nExécution de la migration: ${migration}`);
            const migrationSQL = await fs.readFile(migration, 'utf-8');
            console.log('Fichier de migration lu avec succès');
            
            // Diviser le fichier SQL en instructions individuelles
            const statements = migrationSQL.split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt && !stmt.startsWith('--') && stmt !== '');
            
            console.log(`Nombre total d'instructions SQL à exécuter: ${statements.length}`);
        }
        
        // Exécuter chaque instruction individuellement
        for (const stmt of statements) {
            try {
                console.log('Exécution de la requête:', stmt.substring(0, 50) + '...');
                await connection.promise().query(stmt);
                console.log('Requête exécutée avec succès');
            } catch (error) {
                console.error('Erreur lors de l\'exécution de la requête:', stmt);
                console.error('Erreur détaillée:', error);
                throw error;
            }
        }
        
        console.log('Toutes les tables ont été créées avec succès');
        
        // Fermer la connexion
        await connection.promise().end();
        console.log('Connexion fermée');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        throw error;
    }
}

module.exports = { initializeDatabase };
