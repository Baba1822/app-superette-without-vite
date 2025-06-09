require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2');

console.log('Configuration de la base de données:');
console.log('Host:', process.env.DB_HOST || 'localhost');
console.log('User:', process.env.DB_USER || 'root');
console.log('Database:', process.env.DB_NAME || 'baba');

async function initDB() {
    try {
        console.log('Connecté à MySQL');
        
        // Créer la base de données si elle n'existe pas
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        await connection.promise().query('CREATE DATABASE IF NOT EXISTS baba');
        console.log('Requête exécutée: CREATE DATABASE IF NOT EXISTS baba');

        // Utiliser la base de données
        await connection.promise().query('USE baba');
        console.log('Requête exécutée: USE baba');

        // Exécuter les migrations dans l'ordre
        const migrations = [
            './migrations/001_initial_schema.sql',
            './migrations/002_rename_password_column.sql'
        ];

        for (const migration of migrations) {
            console.log(`\nExécution de la migration: ${migration}`);
            const sql = await fs.readFile(path.join(__dirname, '..', migration), 'utf-8');
            
            // Exécuter le SQL complet en une seule requête
            const query = sql.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            console.log(`\nExécutant la requête:\n${query}`);
            await connection.promise().query(query);
            console.log(`Requête exécutée avec succès`);
        }

        console.log('Base de données et tables créées avec succès !');
        connection.end();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        throw error;
    }
}

initDB();
