const Loyalty = require('../models/Loyalty');

exports.getClientLoyalty = async (req, res) => {
    try {
        const loyalty = await Loyalty.getClientLoyalty(req.params.clientId);
        if (!loyalty) {
            return res.json({});
        }
        
        // Formater la réponse pour correspondre au frontend
        const formattedCard = {
            id: loyalty.id,
            clientId: loyalty.client_id,
            cardNumber: loyalty.card_number || `CARD${String(loyalty.client_id).padStart(6, '0')}`,
            points: loyalty.points || 0,
            tier: calculateTier(loyalty.points || 0),
            joinDate: loyalty.created_at ? new Date(loyalty.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            totalSpent: loyalty.total_spent || 0
        };
        
        res.json(formattedCard);
    } catch (error) {
        console.error('Erreur getClientLoyalty:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du statut de fidélité' });
    }
};

// Fonction helper pour calculer le tier
function calculateTier(points) {
    if (points >= 1000) return 'Gold';
    if (points >= 500) return 'Silver';
    return 'Bronze';
}

exports.createLoyaltyCard = async (req, res) => {
    try {
        const { customerId, initialPoints = 0, customerName, cardNumber } = req.body;
        
        // Vérifier si une carte existe déjà
        const existingCard = await Loyalty.getClientLoyalty(customerId);
        if (existingCard) {
            return res.status(400).json({ error: 'Une carte de fidélité existe déjà pour ce client' });
        }
        
        const newCard = await Loyalty.createLoyaltyCard(customerId, initialPoints);
        
        const formattedCard = {
            id: newCard.id,
            clientId: customerId,
            customerName: customerName || `Client ${customerId}`,
            cardNumber: cardNumber || `CARD${String(customerId).padStart(6, '0')}`,
            points: initialPoints,
            tier: calculateTier(initialPoints),
            joinDate: new Date().toISOString().split('T')[0],
            totalSpent: 0
        };
        
        res.status(201).json(formattedCard);
    } catch (error) {
        console.error('Erreur createLoyaltyCard:', error);
        res.status(500).json({ error: 'Erreur lors de la création de la carte' });
    }
};

exports.updateLoyaltyCard = async (req, res) => {
    try {
        const updatedCard = await Loyalty.updateLoyaltyCard(req.params.cardId, req.body);
        
        const formattedCard = {
            id: updatedCard.id,
            clientId: updatedCard.client_id,
            cardNumber: updatedCard.card_number || `CARD${String(updatedCard.client_id).padStart(6, '0')}`,
            points: updatedCard.points || 0,
            tier: calculateTier(updatedCard.points || 0),
            joinDate: updatedCard.created_at ? new Date(updatedCard.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            totalSpent: updatedCard.total_spent || 0
        };
        
        res.json(formattedCard);
    } catch (error) {
        console.error('Erreur updateLoyaltyCard:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la carte' });
    }
};

exports.deleteLoyaltyCard = async (req, res) => {
    try {
        await Loyalty.deleteLoyaltyCard(req.params.cardId);
        res.json({ message: 'Carte supprimée avec succès' });
    } catch (error) {
        console.error('Erreur deleteLoyaltyCard:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de la carte' });
    }
};

exports.addPoints = async (req, res) => {
    try {
        const { points, amount, transactionId } = req.body;
        const result = await Loyalty.addPoints(req.params.clientId, points, amount, transactionId);
        res.json(result);
    } catch (error) {
        console.error('Erreur addPoints:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.getPointsHistory = async (req, res) => {
    try {
        const history = await Loyalty.getPointsHistory(req.params.clientId);
        
        // Formater l'historique pour le frontend
        const formattedHistory = history.map(item => ({
            id: item.id,
            date: item.transaction_date ? new Date(item.transaction_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            points: item.points,
            type: item.points > 0 ? 'earn' : 'redeem',
            transaction: item.transaction_id,
            rewardName: item.reward_name || null
        }));
        
        res.json(formattedHistory);
    } catch (error) {
        console.error('Erreur getPointsHistory:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
    }
};

exports.getAvailableRewards = async (req, res) => {
    try {
        const clientId = req.query.clientId || null;
        const rewards = await Loyalty.getAvailableRewards(clientId);
        
        // Vérifier si des récompenses existent
        if (!rewards || rewards.length === 0) {
            return res.json([]);
        }
        
        // Formater les récompenses
        const formattedRewards = rewards.map(reward => ({
            id: reward.id,
            name: reward.name,
            description: reward.description,
            pointsCost: reward.points_required || reward.pointsCost,
            active: reward.active
        }));
        
        res.json(formattedRewards);
    } catch (error) {
        console.error('Erreur getAvailableRewards:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des récompenses disponibles' });
    }
};

exports.redeemReward = async (req, res) => {
    try {
        const { rewardId, pointsToRedeem } = req.body;
        const result = await Loyalty.redeemReward(req.params.clientId, rewardId, pointsToRedeem);
        res.json({ success: result });
    } catch (error) {
        console.error('Erreur redeemReward:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.checkRewardAvailability = async (req, res) => {
    try {
        const available = await Loyalty.checkRewardAvailability(
            req.query.clientId, 
            req.params.rewardId
        );
        res.json({ available });
    } catch (error) {
        console.error('Erreur checkRewardAvailability:', error);
        res.status(500).json({ error: 'Erreur lors de la vérification de disponibilité' });
    }
};

exports.getLoyaltyStats = async (req, res) => {
    try {
        const stats = await Loyalty.getLoyaltyStats();
        
        if (!stats) {
            return res.status(404).json({ error: 'Aucune statistique disponible' });
        }
        
        // Retourner les vraies statistiques de la base de données
        res.json(stats);
    } catch (error) {
        console.error('Erreur getLoyaltyStats:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
};

exports.checkLoyaltyTier = async (req, res) => {
    try {
        const loyalty = await Loyalty.getClientLoyalty(req.params.clientId);
        if (!loyalty) {
            return res.status(404).json({ error: 'Carte de fidélité non trouvée' });
        }
        
        const tier = calculateTier(loyalty.points || 0);
        res.json({ 
            tier,
            points: loyalty.points || 0,
            nextTier: getNextTier(tier),
            pointsToNextTier: getPointsToNextTier(loyalty.points || 0)
        });
    } catch (error) {
        console.error('Erreur checkLoyaltyTier:', error);
        res.status(500).json({ error: 'Erreur lors de la vérification du niveau' });
    }
};

function getNextTier(currentTier) {
    switch (currentTier) {
        case 'Bronze': return 'Silver';
        case 'Silver': return 'Gold';
        case 'Gold': return null;
        default: return 'Silver';
    }
}

function getPointsToNextTier(currentPoints) {
    if (currentPoints < 500) return 500 - currentPoints;
    if (currentPoints < 1000) return 1000 - currentPoints;
    return 0;
}