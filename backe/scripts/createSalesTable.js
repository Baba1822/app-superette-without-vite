const mysql = require('mysql2/promise');

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'baba',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

async function createSalesTable() {
    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log('Connexion à la base de données établie');

        // Vérifier si la table sales existe
        const [tables] = await connection.execute("SHOW TABLES LIKE 'sales'");
        
        if (tables.length === 0) {
            console.log('Table sales n\'existe pas. Création en cours...');
            
            const createTableSQL = `
                CREATE TABLE sales (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    order_id INT UNIQUE,
                    date DATETIME NOT NULL,
                    client_id INT,
                    client_name VARCHAR(255),
                    products_json JSON NOT NULL,
                    total_amount DECIMAL(10, 2) NOT NULL,
                    payment_method VARCHAR(50),
                    status VARCHAR(50) NOT NULL,
                    notes TEXT,
                    customer_address VARCHAR(255),
                    customer_phone VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
                )
            `;
            
            await connection.execute(createTableSQL);
            console.log('Table sales créée avec succès');
        } else {
            console.log('Table sales existe déjà');
        }

        // Vérifier la structure de la table
        const [columns] = await connection.execute("DESCRIBE sales");
        console.log('Structure de la table sales:');
        columns.forEach(col => {
            console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
        });

    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

createSalesTable(); 