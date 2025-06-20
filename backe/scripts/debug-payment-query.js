const pool = require('../config/db');

async function debugPaymentQuery() {
    try {
        console.log('Test de la requête SQL du modèle Payment...');
        
        // Test 1: Vérifier la structure des tables
        console.log('\n1. Structure de la table paiements:');
        const [paiementsColumns] = await pool.query('DESCRIBE paiements');
        paiementsColumns.forEach(col => console.log(`- ${col.Field}: ${col.Type}`));
        
        console.log('\n2. Structure de la table commandes:');
        const [commandesColumns] = await pool.query('DESCRIBE commandes');
        commandesColumns.forEach(col => console.log(`- ${col.Field}: ${col.Type}`));
        
        console.log('\n3. Structure de la table clients:');
        const [clientsColumns] = await pool.query('DESCRIBE clients');
        clientsColumns.forEach(col => console.log(`- ${col.Field}: ${col.Type}`));
        
        // Test 2: Vérifier les données
        console.log('\n4. Données dans paiements:');
        const [paiements] = await pool.query('SELECT * FROM paiements LIMIT 3');
        console.log(paiements);
        
        console.log('\n5. Données dans commandes:');
        const [commandes] = await pool.query('SELECT * FROM commandes LIMIT 3');
        console.log(commandes);
        
        console.log('\n6. Données dans clients:');
        const [clients] = await pool.query('SELECT * FROM clients LIMIT 3');
        console.log(clients);
        
        // Test 3: Tester la requête complète
        console.log('\n7. Test de la requête complète:');
        try {
            const [result] = await pool.query(`
                SELECT p.*, c.nom as client_name, o.total as order_total 
                FROM paiements p 
                LEFT JOIN commandes o ON p.commande_id = o.id 
                LEFT JOIN clients c ON o.client_id = c.id
                ORDER BY p.date_paiement DESC
            `);
            console.log('✅ Requête réussie!');
            console.log('Résultats:', result);
        } catch (error) {
            console.log('❌ Erreur dans la requête:', error.message);
        }
        
    } catch (error) {
        console.error('Erreur générale:', error);
    } finally {
        await pool.end();
    }
}

debugPaymentQuery(); 