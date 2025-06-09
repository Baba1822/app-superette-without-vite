const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function createConnection() {
    try {
        return await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'superette'
        });
    } catch (error) {
        console.error('Erreur lors de la création de la connexion:', error);
        throw error;
    }
}

async function executeMigration(migrationFile) {
    try {
        const conn = await createConnection();
        
        // Lire le contenu du fichier de migration
        const migrationPath = path.join(__dirname, '..', 'migrations', migrationFile);
        const sql = fs.readFileSync(migrationPath, 'utf8');
        
        // Diviser le SQL en statements individuels
        const statements = sql.split(';').filter(stmt => stmt.trim());
        
        // Exécuter chaque statement individuellement
        for (const statement of statements) {
            if (statement.trim()) {
                await conn.query(statement + ';');
            }
        }
        
        console.log(`Migration ${migrationFile} exécutée avec succès`);
        
        await conn.end();
    } catch (error) {
        console.error(`Erreur lors de l'exécution de la migration ${migrationFile}:`, error);
        throw error;
    }
}

async function runMigrations() {
    try {
        // Lister tous les fichiers de migration
        const migrationsDir = path.join(__dirname, '..', 'migrations');
        const migrations = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        for (const migration of migrations) {
            await executeMigration(migration);
        }

        console.log('Toutes les migrations ont été exécutées avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'exécution des migrations:', error);
        throw error;
    }
}

// Exécuter les migrations
runMigrations().catch(console.error);
