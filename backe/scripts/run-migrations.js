const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Configuration de la base de données
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'baba'
});

// Fonction pour exécuter une migration
const executeMigration = (sql) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

// Lire et exécuter toutes les migrations
const runMigrations = async () => {
    try {
        // Lire le fichier de migration
        const migrationFile = path.join(__dirname, '..', 'migrations', 'clients.sql');
        const sql = fs.readFileSync(migrationFile, 'utf8');

        // Exécuter la migration
        await executeMigration(sql);
        console.log('Migration clients effectuée avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'exécution des migrations:', error);
    }
};

// Exécuter les migrations
runMigrations();
