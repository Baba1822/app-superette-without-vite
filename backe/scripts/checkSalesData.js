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

async function checkSalesData() {
    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log('Connexion à la base de données établie');

        // Vérifier les données de la table sales
        const [sales] = await connection.execute("SELECT * FROM sales");
        console.log(`Nombre de ventes dans la base: ${sales.length}`);

        if (sales.length > 0) {
            console.log('\nPremière vente:');
            console.log({
                id: sales[0].id,
                date: sales[0].date,
                client_id: sales[0].client_id,
                client_name: sales[0].client_name,
                total_amount: sales[0].total_amount,
                payment_method: sales[0].payment_method,
                status: sales[0].status,
                products_json: sales[0].products_json
            });

            // Parser les produits JSON
            try {
                const products = JSON.parse(sales[0].products_json);
                console.log('Produits parsés:', products);
            } catch (e) {
                console.error('Erreur lors du parsing des produits:', e);
            }
        }

        // Vérifier la structure de la table
        const [columns] = await connection.execute("DESCRIBE sales");
        console.log('\nStructure de la table sales:');
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

checkSalesData(); 