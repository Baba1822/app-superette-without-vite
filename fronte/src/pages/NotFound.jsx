import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>404 - Page non trouvée</h1>
            <p>Oups ! La page que vous recherchez n'existe pas.</p>
            <Link to="/">Retour à l'accueil</Link>
        </div>
    );
};

export default NotFound;
