const mysql = require('mysql2');

// Configuration de la connexion à MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'baba'
});

async function checkTables() {
    try {
        // Se connecter à la base de données
        await connection.promise().connect();
        console.log('Connecté à la base de données');

        // Liste des tables à vérifier
        const tables = [
            'utilisateurs',
            'categories_produits',
            'produits',
            'fournisseurs',
            'commandes',
            'details_commande',
            'livraisons',
            'mouvements_stock',
            'depenses',
            'categories_depenses',
            'promotions',
            'cartes_fidelite',
            'recompenses',
            'historique_recompenses',
            'avis_produits',
            'caisse',
            'historique_caisse',
            'stocks',
            'inventaires',
            'rapports',
            'notifications'
        ];

        for (const table of tables) {
            console.log(`\nStructure de la table ${table}:`);
            
            // Récupérer la structure de la table
            const [columns] = await connection.promise().query(
                `DESCRIBE ${table}`
            );

            // Afficher les colonnes
            console.table(columns);

            // Vérifier le nombre de lignes
            const [count] = await connection.promise().query(
                `SELECT COUNT(*) as count FROM ${table}`
            );
            console.log(`Nombre de lignes dans ${table}:`, count[0].count);
        }

        console.log('\nVérification terminée avec succès !');

    } catch (error) {
        console.error('Erreur lors de la vérification:', error);
    } finally {
        connection.end();
    }
}

// Exécuter la vérification
checkTables();
