const pool = require('../config/db');

async function createPaymentsTable() {
    try {
        console.log('Vérification de la table paiements...');
        
        // Vérifier si la table existe
        const [tables] = await pool.query(
            "SHOW TABLES LIKE 'paiements'"
        );
        
        if (tables.length === 0) {
            console.log('Table paiements non trouvée. Création en cours...');
            
            // Créer la table paiements
            await pool.query(`
                CREATE TABLE paiements (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    order_id INT,
                    client_id INT,
                    amount DECIMAL(10,2) NOT NULL,
                    payment_method VARCHAR(50) NOT NULL,
                    status VARCHAR(20) DEFAULT 'pending',
                    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    reference_number VARCHAR(100),
                    note TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (order_id) REFERENCES commandes(id) ON DELETE SET NULL,
                    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
                )
            `);
            
            console.log('Table paiements créée avec succès!');
        } else {
            console.log('Table paiements existe déjà.');
        }
        
        // Vérifier si la table paiements_echelones existe
        const [installmentTables] = await pool.query(
            "SHOW TABLES LIKE 'paiements_echelones'"
        );
        
        if (installmentTables.length === 0) {
            console.log('Table paiements_echelones non trouvée. Création en cours...');
            
            // Créer la table paiements_echelones
            await pool.query(`
                CREATE TABLE paiements_echelones (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    payment_id INT NOT NULL,
                    amount DECIMAL(10,2) NOT NULL,
                    due_date DATE NOT NULL,
                    status VARCHAR(20) DEFAULT 'pending',
                    note TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (payment_id) REFERENCES paiements(id) ON DELETE CASCADE
                )
            `);
            
            console.log('Table paiements_echelones créée avec succès!');
        } else {
            console.log('Table paiements_echelones existe déjà.');
        }
        
        // Insérer quelques données de test si la table est vide
        const [existingPayments] = await pool.query('SELECT COUNT(*) as count FROM paiements');
        
        if (existingPayments[0].count === 0) {
            console.log('Insertion de données de test...');
            
            // Insérer des paiements de test
            await pool.query(`
                INSERT INTO paiements (order_id, client_id, amount, payment_method, status, reference_number) VALUES
                (1, 1, 50000.00, 'CARD', 'COMPLETED', 'REF001'),
                (2, 1, 75000.00, 'MOBILE_MONEY', 'PENDING', 'REF002'),
                (3, 2, 120000.00, 'BANK_TRANSFER', 'COMPLETED', 'REF003')
            `);
            
            console.log('Données de test insérées avec succès!');
        }
        
        console.log('Vérification terminée avec succès!');
        
    } catch (error) {
        console.error('Erreur lors de la création des tables:', error);
    } finally {
        await pool.end();
    }
}

createPaymentsTable(); 