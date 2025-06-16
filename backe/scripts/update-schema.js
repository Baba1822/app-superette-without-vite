const mysql = require('mysql2');
const fs = require('fs');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'baba',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const executeQuery = async (query) => {
    try {
        const [results] = await pool.promise().query(query);
        console.log('Requête exécutée avec succès:', query.split('\n')[0]);
        return results;
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la requête:', query.split('\n')[0], error);
        throw error;
    }
};

const updateSchema = async () => {
    try {
        const sql = fs.readFileSync('./database/update_schema.sql', 'utf8');
        const queries = sql.split(';\n');
        
        for (const query of queries) {
            if (query.trim()) {
                await executeQuery(query);
            }
        }
        
        console.log('Mise à jour du schéma réussie');
    } catch (error) {
        console.error('Erreur lors de la mise à jour du schéma:', error);
        process.exit(1);
    }
};

updateSchema();
