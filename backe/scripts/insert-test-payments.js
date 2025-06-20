const pool = require('../config/db');

async function insertTestPayments() {
    try {
        console.log('Insertion de données de test dans la table paiements...');
        
        // Vérifier s'il y a déjà des données
        const [existingCount] = await pool.query('SELECT COUNT(*) as count FROM paiements');
        
        if (existingCount[0].count === 0) {
            // Insérer des paiements de test
            await pool.query(`
                INSERT INTO paiements (commande_id, montant, methode_paiement, statut, date_paiement, reference) VALUES
                (1, 50000.00, 'carte', 'terminee', NOW(), 'REF001'),
                (2, 75000.00, 'mobile_money', 'en_attente', NOW(), 'REF002'),
                (3, 120000.00, 'espece', 'terminee', NOW(), 'REF003'),
                (4, 45000.00, 'carte', 'en_attente', NOW(), 'REF004'),
                (5, 89000.00, 'mobile_money', 'terminee', NOW(), 'REF005')
            `);
            
            console.log('5 paiements de test insérés avec succès!');
        } else {
            console.log(`La table contient déjà ${existingCount[0].count} paiements.`);
        }
        
        // Afficher les données insérées
        const [payments] = await pool.query('SELECT * FROM paiements ORDER BY date_paiement DESC LIMIT 5');
        console.log('\nPaiements dans la base de données:');
        payments.forEach(payment => {
            console.log(`- ID: ${payment.id}, Montant: ${payment.montant}, Méthode: ${payment.methode_paiement}, Statut: ${payment.statut}`);
        });
        
    } catch (error) {
        console.error('Erreur lors de l\'insertion des données de test:', error);
    } finally {
        await pool.end();
    }
}

insertTestPayments(); 