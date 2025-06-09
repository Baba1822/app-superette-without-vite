const axios = require('axios');
const { JSDOM } = require('jsdom');

// Créer un environnement DOM
const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
const { window } = dom;

// Configuration pour que axios utilise le navigateur
axios.defaults.adapter = require('axios/lib/adapters/http');

const register = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            prenom: 'Baba',
            nom: 'Keita',
            email: 'test.inscription2@gmail.com',
            telephone: '625647560',
            motdepasse: 'Aly123'
        });
        console.log('Réponse:', response.data);
        
        // Simuler la navigation vers Shop
        if (response.data.redirectUrl) {
            console.log('Redirection vers:', response.data.redirectUrl);
        }
    } catch (error) {
        console.error('Erreur:', error.response ? error.response.data : error.message);
    }
};

register();
