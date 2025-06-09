const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        console.log('Données reçues:', req.body);
        const { email, motdepasse, prenom, nom, telephone, role } = req.body;
        
        console.log('Données traitées:', { email, motdepasse, role, prenom, nom, telephone });
        
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findByEmail(email);
        console.log('Vérification utilisateur existant:', existingUser);
        
        if (existingUser) {
            return res.status(400).json({ error: 'Email déjà utilisé' });
        }

        // Créer l'utilisateur
        const userData = { 
            email: email.toLowerCase(),
            motdepasse: motdepasse,
            type: role || 'client',
            nom: nom || '',
            prenom: prenom || '',
            telephone: telephone || ''
        };
        console.log('Données utilisateur à créer:', userData);
        
        const userId = await User.create(userData);
        console.log('Utilisateur créé avec ID:', userId);

        // Générer un token
        const token = jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        console.log('Token généré:', token);

        // Déterminer la redirection en fonction du type d'utilisateur
        let redirectUrl = '/';
        if (role === 'client') {
            redirectUrl = '/Shop';
        }

        res.status(201).json({
            success: true,
            token,
            user: {
                id: userId,
                email,
                nom: nom || '',
                prenom: prenom || '',
                telephone: telephone || '',
                type: role
            },
            redirectUrl
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ 
            error: 'Erreur lors de l\'inscription', 
            details: error.message 
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, motdepasse } = req.body;
        
        // Vérifier si l'utilisateur existe
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Vérifier le mot de passe
        const isValidPassword = await User.verifyPassword(user, motdepasse);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Générer un token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Déterminer la redirection en fonction du type d'utilisateur
        let redirectUrl = '/';
        if (user.type === 'admin') {
            redirectUrl = '/administration';
        } else if (user.type === 'client') {
            redirectUrl = '/Shop';
        } else if (user.type === 'cashier') {
            redirectUrl = '/caisse';
        } else if (user.type === 'stockist') {
            redirectUrl = '/inventaire';
        } else if (user.type === 'manager') {
            redirectUrl = '/finances';
        }

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                telephone: user.telephone,
                type: user.type
            },
            redirectPath: redirectUrl
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la connexion', 
            details: error.message 
        });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.getById(req.user.userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des informations utilisateur' });
    }
};
