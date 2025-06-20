const pool = require('../config/db');

async function insertTestData() {
    try {
        console.log('Insertion de données de test...');
        
        // 1. Vérifier s'il y a des clients
        const [clients] = await pool.query('SELECT id FROM clients LIMIT 2');
        console.log(`Clients trouvés: ${clients.length}`);
        
        if (clients.length === 0) {
            console.log('Aucun client trouvé. Création d\'un client de test...');
            await pool.query(`
                INSERT INTO clients (nom, email, telephone, adresse) VALUES
                ('Client Test', 'client@test.com', '123456789', 'Adresse Test')
            `);
            const [newClients] = await pool.query('SELECT id FROM clients LIMIT 1');
            clients.push(newClients[0]);
        }
        
        // 2. Insérer des commandes de test
        const [existingCommandes] = await pool.query('SELECT COUNT(*) as count FROM commandes');
        
        if (existingCommandes[0].count === 0) {
            console.log('Insertion de commandes de test...');
            
            const clientId = clients[0].id;
            await pool.query(`
                INSERT INTO commandes (client_id, total, statut, date_commande) VALUES
                (${clientId}, 50000.00, 'terminee', NOW()),
                (${clientId}, 75000.00, 'en_cours', NOW()),
                (${clientId}, 120000.00, 'terminee', NOW()),
                (${clientId}, 45000.00, 'en_cours', NOW()),
                (${clientId}, 89000.00, 'terminee', NOW())
            `);
            
            console.log('5 commandes de test insérées avec succès!');
        } else {
            console.log(`La table commandes contient déjà ${existingCommandes[0].count} commandes.`);
        }
        
        // 3. Insérer des paiements de test
        const [commandes] = await pool.query('SELECT id FROM commandes LIMIT 5');
        const [existingPaiements] = await pool.query('SELECT COUNT(*) as count FROM paiements');
        
        if (existingPaiements[0].count === 0 && commandes.length > 0) {
            console.log('Insertion de paiements de test...');
            
            const values = commandes.map((commande, index) => {
                const methods = ['carte', 'mobile_money', 'espece'];
                const statuses = ['terminee', 'en_attente'];
                const method = methods[index % methods.length];
                const status = statuses[index % statuses.length];
                const amount = 50000 + (index * 25000);
                
                return `(${commande.id}, ${amount}.00, '${method}', '${status}', NOW(), 'REF00${index + 1}')`;
            }).join(', ');
            
            await pool.query(`
                INSERT INTO paiements (commande_id, montant, methode_paiement, statut, date_paiement, reference) VALUES
                ${values}
            `);
            
            console.log(`${commandes.length} paiements de test insérés avec succès!`);
        } else {
            console.log(`La table paiements contient déjà ${existingPaiements[0].count} paiements.`);
        }
        
        // 4. Afficher un résumé
        const [finalPaiements] = await pool.query('SELECT * FROM paiements ORDER BY date_paiement DESC LIMIT 3');
        console.log('\nRésumé des paiements dans la base de données:');
        finalPaiements.forEach(payment => {
            console.log(`- ID: ${payment.id}, Commande: ${payment.commande_id}, Montant: ${payment.montant}, Méthode: ${payment.methode_paiement}, Statut: ${payment.statut}`);
        });
        
        console.log('\n✅ Données de test insérées avec succès!');
        console.log('L\'interface PaymentManagement devrait maintenant fonctionner sans erreur 500.');
        
    } catch (error) {
        console.error('Erreur lors de l\'insertion des données de test:', error);
    } finally {
        await pool.end();
    }
}

insertTestData(); 