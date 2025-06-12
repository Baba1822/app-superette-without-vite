const errorHandler = (err, req, res, next) => {
    console.error('Erreur:', err);

    // Log des détails de la requête
    console.log('Requête:', {
        method: req.method,
        url: req.url,
        body: req.body,
        params: req.params,
        query: req.query
    });

    // Gestion des erreurs de base de données
    if (err instanceof Error && err.code === 'ER_BAD_FIELD_ERROR') {
        return res.status(400).json({
            error: 'Champ invalide',
            message: `Le champ ${err.sqlMessage.split(' ')[1]} est invalide`
        });
    }

    // Gestion des erreurs de validation
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation échouée',
            message: err.message
        });
    }

    // Erreur de connexion à la base de données
    if (err.code === 'ECONNREFUSED') {
        return res.status(503).json({
            error: 'Service indisponible',
            message: 'Impossible de se connecter à la base de données'
        });
    }

    // Erreur générique
    res.status(500).json({
        error: 'Erreur serveur',
        message: 'Une erreur interne s\'est produite'
    });
};

module.exports = errorHandler;
