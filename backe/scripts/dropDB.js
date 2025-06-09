const mysql = require('mysql2');

// Configuration de la connexion à MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

async function dropDatabase() {
    try {
        // Se connecter à MySQL
        await connection.promise().connect();
        console.log('Connecté à MySQL');

        // Supprimer l'ancienne base de données
        await connection.promise().query('DROP DATABASE IF EXISTS baba');
        console.log('Ancienne base de données supprimée');

        // Créer la nouvelle base de données
        await connection.promise().query('CREATE DATABASE IF NOT EXISTS baba');
        console.log('Nouvelle base de données créée');

        console.log('Opération terminée avec succès !');

    } catch (error) {
        console.error('Erreur lors de la suppression de la base de données:', error);
    } finally {
        connection.end();
    }
}

// Exécuter la suppression
dropDatabase();
