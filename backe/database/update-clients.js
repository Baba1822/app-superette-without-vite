const pool = require('../config/database');

async function updateClientsTable() {
    try {
        console.log('Début de la mise à jour de la table clients...');
        
        // Ajouter les nouveaux champs
        console.log('Ajout des nouveaux champs...');
        await pool.query(`
            ALTER TABLE clients
                ADD COLUMN IF NOT EXISTS password VARCHAR(255) NOT NULL DEFAULT '',
                ADD COLUMN IF NOT EXISTS first_name VARCHAR(255) DEFAULT NULL,
                ADD COLUMN IF NOT EXISTS last_name VARCHAR(255) DEFAULT NULL,
                ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT NULL,
                ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
                ADD COLUMN IF NOT EXISTS role ENUM('client', 'admin', 'cashier', 'stockist', 'manager') DEFAULT 'client',
                ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive', 'blocked') DEFAULT 'active',
                ADD COLUMN IF NOT EXISTS refresh_token VARCHAR(255) DEFAULT NULL,
                ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);

        // Créer les index s'ils n'existent pas déjà
        console.log('Création des index...');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_clients_role ON clients(role)');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status)');

        console.log('Mise à jour terminée avec succès !');
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        process.exit(1);
    }
}

updateClientsTable();
