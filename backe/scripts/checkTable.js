require('dotenv').config();
const mysql = require('mysql2');

console.log('Configuration de la connexion MySQL:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ? '****' : 'empty',
    database: 'baba'
});

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'baba'
});

connection.promise().query('SHOW COLUMNS FROM utilisateurs')
    .then(([rows]) => {
        console.log('Structure de la table utilisateurs:');
        console.log(rows);
        return connection.promise().query('DESCRIBE utilisateurs');
    })
    .then(([rows]) => {
        console.log('Description détaillée de la table utilisateurs:');
        console.log(rows);
        process.exit(0);
    })
    .catch(error => {
        console.error('Erreur:', error);
        process.exit(1);
    });
