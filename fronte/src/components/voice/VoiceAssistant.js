import {
    Close as CloseIcon,
    Help as HelpIcon,
    Mic as MicIcon,
    MicOff as MicOffIcon,
    VolumeUp as VolumeUpIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Divider,
    Drawer,
    Fab,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Tooltip,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import VoiceAssistantService from '../../services/VoiceAssistantService';

const VoiceAssistant = ({ onNavigate }) => {
    const [isListening, setIsListening] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [commands, setCommands] = useState([]);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        setupVoiceAssistant();
    }, []);

    const setupVoiceAssistant = () => {
        try {
            // Configuration des commandes de livraison
            VoiceAssistantService.setupDeliveryCommands(
                (path) => onNavigate(path),
                (query) => handleDeliverySearch(query),
                (id, status) => handleStatusUpdate(id, status)
            );

            // Configuration des commandes de stock
            VoiceAssistantService.setupInventoryCommands(
                (path) => onNavigate(path),
                (product) => handleInventorySearch(product),
                () => handleStockAlerts()
            );

            // Configuration des commandes de paiement
            VoiceAssistantService.setupPaymentCommands(
                (path) => onNavigate(path),
                (amount) => handlePaymentProcess(amount)
            );

            // Récupération de toutes les commandes disponibles
            setCommands(VoiceAssistantService.getAvailableCommands());
        } catch (error) {
            console.error('Erreur lors de la configuration de l\'assistant vocal:', error);
            setShowError(true);
        }
    };

    const toggleListening = () => {
        try {
            VoiceAssistantService.toggleListening();
            setIsListening(!isListening);
            if (!isListening) {
                setTranscript('');
            }
        } catch (error) {
            console.error('Erreur lors de la commutation du microphone:', error);
            setShowError(true);
        }
    };

    const handleDeliverySearch = (query) => {
        VoiceAssistantService.speak(`Recherche de la livraison ${query}`);
        // Implémenter la logique de recherche
    };

    const handleStatusUpdate = (id, status) => {
        VoiceAssistantService.speak(`Mise à jour du statut de la livraison ${id} à ${status}`);
        // Implémenter la logique de mise à jour
    };

    const handleInventorySearch = (product) => {
        VoiceAssistantService.speak(`Vérification du stock pour ${product}`);
        // Implémenter la logique de recherche
    };

    const handleStockAlerts = () => {
        VoiceAssistantService.speak('Affichage des alertes de stock');
        // Implémenter la logique d'affichage
    };

    const handlePaymentProcess = (amount) => {
        VoiceAssistantService.speak(`Traitement du paiement de ${amount} euros`);
        // Implémenter la logique de paiement
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 2
                }}
            >
                {showError && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        onClose={() => setShowError(false)}
                    >
                        L'assistant vocal n'est pas disponible sur votre navigateur
                    </Alert>
                )}

                {isListening && transcript && (
                    <Paper
                        sx={{
                            p: 2,
                            maxWidth: 300,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)'
                        }}
                    >
                        <Typography variant="body2">{transcript}</Typography>
                    </Paper>
                )}

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Aide">
                        <Fab
                            size="small"
                            color="secondary"
                            onClick={toggleDrawer}
                        >
                            <HelpIcon />
                        </Fab>
                    </Tooltip>

                    <Fab
                        color={isListening ? 'secondary' : 'primary'}
                        onClick={toggleListening}
                    >
                        {isListening ? <MicOffIcon /> : <MicIcon />}
                    </Fab>
                </Box>
            </Box>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer}
            >
                <Box sx={{ width: 350, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Assistant Vocal</Typography>
                        <IconButton onClick={toggleDrawer}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Alert severity="info" sx={{ mb: 2 }}>
                        Dites "Assistant" suivi d'une commande pour l'activer
                    </Alert>

                    <Typography variant="subtitle1" gutterBottom>
                        Commandes disponibles
                    </Typography>

                    <List>
                        {commands.map((cmd, index) => (
                            <React.Fragment key={cmd.command}>
                                <ListItem>
                                    <ListItemIcon>
                                        <VolumeUpIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={cmd.command}
                                        secondary={cmd.description}
                                    />
                                </ListItem>
                                {index < commands.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default VoiceAssistant; 