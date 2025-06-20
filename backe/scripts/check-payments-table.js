const pool = require('../config/db');

async function checkPaymentsTable() {
    try {
        console.log('Vérification de la structure de la table paiements...');
        
        // Vérifier la structure de la table
        const [columns] = await pool.query('DESCRIBE paiements');
        
        console.log('Colonnes existantes dans la table paiements:');
        columns.forEach(col => {
            console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
        });
        
        // Vérifier s'il y a des données
        const [count] = await pool.query('SELECT COUNT(*) as count FROM paiements');
        console.log(`\nNombre de paiements dans la table: ${count[0].count}`);
        
        if (count[0].count > 0) {
            const [sampleData] = await pool.query('SELECT * FROM paiements LIMIT 3');
            console.log('\nExemples de données:');
            sampleData.forEach(row => {
                console.log(row);
            });
        }
        
    } catch (error) {
        console.error('Erreur lors de la vérification:', error);
    } finally {
        await pool.end();
    }
}

checkPaymentsTable(); 