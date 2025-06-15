const pool = require('../config/database');

async function runMigration() {
    try {
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?', ['clients']);
        
        if (rows[0].count > 0) {
            console.log('La table clients existe déjà. Suppression et recréation...');
            await pool.query('DROP TABLE clients');
        }

        console.log('Exécution de la migration...');
        await pool.query(`
            CREATE TABLE clients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                phone VARCHAR(20),
                address TEXT,
                role ENUM('client', 'admin', 'cashier', 'stockist', 'manager') DEFAULT 'client',
                status ENUM('active', 'inactive', 'blocked') DEFAULT 'active',
                refresh_token VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Création des index...');
        await pool.query('CREATE INDEX idx_clients_email ON clients(email)');
        await pool.query('CREATE INDEX idx_clients_role ON clients(role)');
        await pool.query('CREATE INDEX idx_clients_status ON clients(status)');

        console.log('Migration terminée avec succès !');
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la migration:', error);
        process.exit(1);
    }
}

runMigration();
