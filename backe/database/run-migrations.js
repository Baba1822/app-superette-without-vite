const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'baba'; // Assurez-vous que DB_NAME est défini

async function runMigrations() {
    let connection;
    try {
        // Connexion au serveur MySQL sans spécifier de base de données pour pouvoir la créer/sélectionner
        connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
        });

        console.log(`Connexion à la base de données ${DB_NAME} établie.`);

        // Créer la base de données si elle n'existe pas
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
        console.log(`Base de données \'${DB_NAME}\' assurée.`);

        // Sélectionner la base de données
        await connection.query(`USE ${DB_NAME}`);
        console.log(`Base de données \'${DB_NAME}\' sélectionnée.`);

        const migrationsDir = path.resolve(__dirname, '../migrations');
        const migrationFiles = await fs.readdir(migrationsDir);

        // Filtrer et trier les fichiers de migration (par exemple, 001_initial_schema.sql, 002_add_something.sql)
        const sortedMigrations = migrationFiles
            .filter(file => file.endsWith('.sql'))
            .sort();

        console.log(`Trouvé ${sortedMigrations.length} migrations.`);

        for (const file of sortedMigrations) {
            console.log(`Exécution de la migration: ${file}...`);
            const filePath = path.join(migrationsDir, file);
            const sql = await fs.readFile(filePath, 'utf8');

            if (file === '002_rename_password_column.sql') {
                // Vérifier si la colonne 'mot_de_passe' existe avant de la renommer
                const [rows] = await connection.query(
                    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'utilisateurs' AND COLUMN_NAME = 'mot_de_passe'",
                    [DB_NAME]
                );
                if (rows.length > 0) {
                    const queries = sql.split(';').filter(query => query.trim().length > 0);
                    for (const query of queries) {
                        await connection.query(query);
                    }
                    console.log(`Migration ${file} (renommage de colonne) terminée.`);
                } else {
                    console.log(`Migration ${file} ignorée car la colonne 'mot_de_passe' n'existe pas.`);
                }
            } else {
                // Pour les autres migrations, exécuter normalement
                const queries = sql.split(';').filter(query => query.trim().length > 0);
                for (const query of queries) {
                    await connection.query(query);
                }
                console.log(`Migration ${file} terminée.`);
            }
        }

        console.log('Toutes les migrations ont été exécutées avec succès !');
    } catch (error) {
        console.error('Erreur lors de l\'exécution des migrations:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Connexion à la base de données fermée.');
        }
    }
}

runMigrations(); 