import {
    Add as AddIcon,
    Delete as DeleteIcon,
    DeliveryDining as DeliveryIcon,
    Directions as DirectionsIcon,
    Edit as EditIcon,
    Help as HelpIcon,
    History as HistoryIcon,
    LocationOn as LocationIcon,
    Mic as MicIcon,
    MicOff as MicOffIcon,
    Person as PersonIcon,
    Search as SearchIcon,
    Timer as TimerIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Paper,
    Rating,
    Select,
    Snackbar,
    Switch,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

// Mock data for delivery services
const deliveryServices = [
    { id: 1, name: 'Livraison Express', fee: 5000, estimatedTime: '1-2 heures', status: 'active' },
    { id: 2, name: 'Livraison Standard', fee: 3000, estimatedTime: '3-4 heures', status: 'active' },
    { id: 3, name: 'Livraison Économique', fee: 2000, estimatedTime: '24 heures', status: 'active' },
];

// Mock data for delivery personnel
const initialDeliveryPersonnel = [
    { id: 1, name: 'Mamadou Diallo', phone: '622123456', status: 'available', vehicle: 'Moto' },
    { id: 2, name: 'Fatoumata Bamba', phone: '623456789', status: 'on_delivery', vehicle: 'Moto' },
    { id: 3, name: 'Ibrahima Koné', phone: '624789123', status: 'available', vehicle: 'Vélo' },
];

// Mock data for delivery zones
const deliveryZones = [
    { id: 1, name: 'Zone 1', fee: 2000, estimatedTime: '30 minutes' },
    { id: 2, name: 'Zone 2', fee: 3000, estimatedTime: '45 minutes' },
    { id: 3, name: 'Zone 3', fee: 4000, estimatedTime: '1 heure' },
];

// Mock data for deliveries
const deliveries = [
    {
        id: 1,
        orderId: 'ORD-001',
        customer: 'Client A',
        address: '123 Rue de la Paix',
        zone: 'Zone 1',
        service: 'Livraison Express',
        status: 'pending',
        assignedTo: 'Mamadou Diallo',
        estimatedDelivery: '2024-03-15 14:30',
        actualDelivery: null,
        fee: 5000,
    },
    {
        id: 2,
        orderId: 'ORD-002',
        customer: 'Client B',
        address: '456 Avenue de la Liberté',
        zone: 'Zone 2',
        service: 'Livraison Standard',
        status: 'in_progress',
        assignedTo: 'Fatoumata Bamba',
        estimatedDelivery: '2024-03-15 15:00',
        actualDelivery: null,
        fee: 3000,
    },
    {
        id: 3,
        orderId: 'ORD-003',
        customer: 'Client C',
        address: '789 Boulevard de la République',
        zone: 'Zone 3',
        service: 'Livraison Économique',
        status: 'completed',
        assignedTo: 'Ibrahima Koné',
        estimatedDelivery: '2024-03-14 16:00',
        actualDelivery: '2024-03-14 15:45',
        fee: 2000,
    },
];

// Add delivery ratings data
const deliveryRatings = [
    { id: 1, deliveryId: 1, rating: 4.5, comment: 'Livraison rapide et professionnelle', customer: 'Client A' },
    { id: 2, deliveryId: 2, rating: 5, comment: 'Excellent service', customer: 'Client B' },
    { id: 3, deliveryId: 3, rating: 3, comment: 'Livreur en retard', customer: 'Client C' },
];

// Add performance metrics
const performanceMetrics = {
    averageDeliveryTime: 45,
    onTimeDeliveryRate: 85,
    customerSatisfaction: 4.2,
    deliverySuccessRate: 95,
};

// Add real-time tracking data
const realTimeTracking = {
    'Mamadou Diallo': { lat: 9.5122, lng: -13.7126, lastUpdate: new Date() },
    'Fatoumata Bamba': { lat: 9.5150, lng: -13.7150, lastUpdate: new Date() },
    'Ibrahima Koné': { lat: 9.5100, lng: -13.7100, lastUpdate: new Date() },
};

// Add voice commands data
const voiceCommands = [
    {
        command: 'nouvelle livraison',
        description: 'Ouvrir le formulaire de nouvelle livraison',
        action: 'openNewDelivery',
    },
    {
        command: 'chercher [nom]',
        description: 'Rechercher une livraison par nom de client',
        action: 'searchDelivery',
    },
    {
        command: 'statut [numéro]',
        description: 'Vérifier le statut d\'une livraison',
        action: 'checkStatus',
    },
    {
        command: 'livreurs disponibles',
        description: 'Afficher les livreurs disponibles',
        action: 'showAvailableDrivers',
    },
    {
        command: 'suivre [numéro]',
        description: 'Suivre une livraison en temps réel',
        action: 'trackDelivery',
    },
    {
        command: 'performance',
        description: 'Afficher les rapports de performance',
        action: 'showPerformance',
    },
    {
        command: 'aide',
        description: 'Afficher la liste des commandes disponibles',
        action: 'showHelp',
    },
];

// Add driver voice commands
const driverVoiceCommands = [
    {
        command: 'démarrer livraison [numéro]',
        description: 'Démarrer une livraison',
        action: 'startDelivery',
    },
    {
        command: 'terminer livraison [numéro]',
        description: 'Terminer une livraison',
        action: 'completeDelivery',
    },
    {
        command: 'problème [numéro]',
        description: 'Signaler un problème avec une livraison',
        action: 'reportIssue',
    },
    {
        command: 'itinéraire [adresse]',
        description: 'Obtenir l\'itinéraire vers une adresse',
        action: 'getDirections',
    },
    {
        command: 'appeler client [numéro]',
        description: 'Appeler le client d\'une livraison',
        action: 'callCustomer',
    },
    {
        command: 'statut actuel',
        description: 'Vérifier le statut actuel',
        action: 'checkCurrentStatus',
    },
];

// Add voice command history data structure
const initialVoiceHistory = [
    {
        id: 1,
        command: 'nouvelle livraison',
        timestamp: new Date('2024-03-15T10:30:00'),
        user: 'Admin',
        success: true,
    },
    {
        id: 2,
        command: 'chercher Client A',
        timestamp: new Date('2024-03-15T11:15:00'),
        user: 'Admin',
        success: true,
    },
    {
        id: 3,
        command: 'démarrer livraison ORD-001',
        timestamp: new Date('2024-03-15T11:30:00'),
        user: 'Mamadou Diallo',
        success: true,
    },
];

// Vehicle types and status options
const vehicleTypes = ['Moto', 'Vélo', 'Voiture', 'Camionnette'];
const driverStatuses = ['available', 'unavailable', 'on_delivery', 'on_break'];

function Delivery() {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });
    const [activeTab, setActiveTab] = useState(0);
    const [trackingData, setTrackingData] = useState(realTimeTracking);
    const [smsNotifications, setSmsNotifications] = useState({
        enabled: true,
        statusUpdates: true,
        deliveryConfirmation: true,
        delayAlerts: true,
    });
    const [smsDialogOpen, setSmsDialogOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [showVoiceCommands, setShowVoiceCommands] = useState(false);
    const [recognizedText, setRecognizedText] = useState('');
    const [voiceHistory, setVoiceHistory] = useState(initialVoiceHistory);
    const [showVoiceHistory, setShowVoiceHistory] = useState(false);
    const [currentUser, setCurrentUser] = useState('Admin');
    const [deliveryPersons, setDeliveryPersons] = useState(initialDeliveryPersonnel);
    const [openDriverDialog, setOpenDriverDialog] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [newDriver, setNewDriver] = useState({
        name: '',
        phone: '',
        vehicle: 'Moto',
        status: 'available'
    });
    const [driverSearchTerm, setDriverSearchTerm] = useState('');

    const handleOpenDialog = (delivery = null) => {
        setSelectedDelivery(delivery);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedDelivery(null);
    };

    const handleSaveDelivery = () => {
        // Implement save logic
        setSnackbar({
            open: true,
            message: selectedDelivery ? 'Livraison mise à jour' : 'Nouvelle livraison créée',
            severity: 'success',
        });
        handleCloseDialog();
    };

    // Driver management functions
    const handleSaveDriver = () => {
        if (selectedDriver) {
            // Update existing driver
            setDeliveryPersons(deliveryPersons.map(d => 
                d.id === selectedDriver.id ? selectedDriver : d
            ));
            setSnackbar({
                open: true,
                message: 'Livreur mis à jour',
                severity: 'success',
            });
        } else {
            // Add new driver
            const newId = Math.max(...deliveryPersons.map(d => d.id), 0) + 1;
            setDeliveryPersons([
                ...deliveryPersons,
                {
                    id: newId,
                    ...newDriver
                }
            ]);
            setSnackbar({
                open: true,
                message: 'Nouveau livreur ajouté',
                severity: 'success',
            });
        }
        setOpenDriverDialog(false);
        setSelectedDriver(null);
        setNewDriver({
            name: '',
            phone: '',
            vehicle: 'Moto',
            status: 'available'
        });
    };

    const handleDeleteDriver = (id) => {
        setDeliveryPersons(deliveryPersons.filter(d => d.id !== id));
        setSnackbar({
            open: true,
            message: 'Livreur supprimé',
            severity: 'success',
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'in_progress':
                return 'info';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getDriverStatusLabel = (status) => {
        switch (status) {
            case 'available': return 'Disponible';
            case 'unavailable': return 'Indisponible';
            case 'on_delivery': return 'En livraison';
            case 'on_break': return 'En pause';
            default: return status;
        }
    };

    const getDriverStatusColor = (status) => {
        switch (status) {
            case 'available': return 'success';
            case 'on_delivery': return 'info';
            case 'on_break': return 'warning';
            case 'unavailable': return 'error';
            default: return 'default';
        }
    };

    const filteredDeliveries = deliveries.filter((delivery) => {
        const matchesSearch = delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            delivery.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const filteredDrivers = deliveryPersons.filter((driver) => {
        return driver.name.toLowerCase().includes(driverSearchTerm.toLowerCase()) ||
               driver.phone.includes(driverSearchTerm);
    });

    // Add useEffect for real-time tracking simulation
    useEffect(() => {
        const trackingInterval = setInterval(() => {
            // Simulate location updates
            const updatedTracking = { ...trackingData };
            Object.keys(updatedTracking).forEach(deliveryPerson => {
                const currentLocation = updatedTracking[deliveryPerson];
                // Add small random movement
                updatedTracking[deliveryPerson] = {
                    lat: currentLocation.lat + (Math.random() - 0.5) * 0.001,
                    lng: currentLocation.lng + (Math.random() - 0.5) * 0.001,
                    lastUpdate: new Date(),
                };
            });
            setTrackingData(updatedTracking);
        }, 5000); // Update every 5 seconds

        return () => clearInterval(trackingInterval);
    }, [trackingData]);

    // Add function to send SMS notification
    const sendSmsNotification = (phone, message) => {
        // Implement SMS sending logic
        console.log(`Sending SMS to ${phone}: ${message}`);
        setSnackbar({
            open: true,
            message: 'Notification SMS envoyée',
            severity: 'success',
        });
    };

    // Add function to handle delivery status change
    const handleStatusChange = (delivery, newStatus) => {
        // Update delivery status
        const updatedDelivery = { ...delivery, status: newStatus };
        
        // Send SMS notification if enabled
        if (smsNotifications.enabled) {
            const customerPhone = delivery.customerPhone; // Add this to delivery data
            let message = '';
            
            switch (newStatus) {
                case 'in_progress':
                    message = `Votre commande ${delivery.orderId} est en cours de livraison.`;
                    break;
                case 'completed':
                    message = `Votre commande ${delivery.orderId} a été livrée.`;
                    break;
                case 'delayed':
                    message = `Votre commande ${delivery.orderId} est retardée.`;
                    break;
            }
            
            if (message) {
                sendSmsNotification(customerPhone, message);
            }
        }
    };

    // Add function to calculate delivery person rating
    const calculateDeliveryPersonRating = (personName) => {
        const personDeliveries = deliveries.filter(d => d.assignedTo === personName);
        const ratings = deliveryRatings.filter(r => 
            personDeliveries.some(d => d.id === r.deliveryId)
        );
        
        if (ratings.length === 0) return 0;
        
        return ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    };

    // Add function to handle voice recognition
    const startVoiceRecognition = () => {
        setIsListening(true);
        // Simulate voice recognition
        setTimeout(() => {
            const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
            setRecognizedText(randomCommand.command);
            handleVoiceCommand(randomCommand.command);
            setIsListening(false);
        }, 2000);
    };

    // Add function to handle voice commands
    const handleVoiceCommand = (command) => {
        const lowerCommand = command.toLowerCase();
        let success = true;
        
        try {
            if (currentUser.includes('Livreur')) {
                handleDriverVoiceCommand(command);
            } else {
                // Existing admin commands
                if (lowerCommand.includes('nouvelle livraison')) {
                    handleOpenDialog();
                } else if (lowerCommand.includes('chercher')) {
                    const searchTerm = command.split('chercher')[1].trim();
                    setSearchTerm(searchTerm);
                } else if (lowerCommand.includes('statut')) {
                    const orderId = command.split('statut')[1].trim();
                    const delivery = deliveries.find(d => d.orderId === orderId);
                    if (delivery) {
                        setSnackbar({
                            open: true,
                            message: `Statut de la livraison ${orderId}: ${delivery.status}`,
                            severity: 'info',
                        });
                    }
                } else if (lowerCommand.includes('livreurs disponibles')) {
                    const available = deliveryPersons.filter(p => p.status === 'available');
                    setSnackbar({
                        open: true,
                        message: `${available.length} livreurs disponibles`,
                        severity: 'info',
                    });
                } else if (lowerCommand.includes('suivre')) {
                    const orderId = command.split('suivre')[1].trim();
                    setActiveTab(1);
                } else if (lowerCommand.includes('performance')) {
                    setActiveTab(3);
                } else if (lowerCommand.includes('aide')) {
                    setShowVoiceCommands(true);
                } else if (lowerCommand.includes('historique')) {
                    setShowVoiceHistory(true);
                }
            }
        } catch (error) {
            success = false;
            setSnackbar({
                open: true,
                message: 'Erreur lors de l\'exécution de la commande',
                severity: 'error',
            });
        }
        
        addToVoiceHistory(command, success);
    };

    // Add function to record voice command history
    const addToVoiceHistory = (command, success) => {
        const newEntry = {
            id: voiceHistory.length + 1,
            command,
            timestamp: new Date(),
            user: currentUser,
            success,
        };
        setVoiceHistory([newEntry, ...voiceHistory]);
    };

    // Fonction pour gérer les commandes vocales des livreurs
    const handleDriverVoiceCommand = (command) => {
        // Logique de traitement des commandes vocales des livreurs
        console.log('Commande vocale livreur:', command);
        // Ajoutez ici la logique de traitement des commandes
    };

    return (
        <Box>
            {/* Header with buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Service de livraison</Typography>
                <Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDriverDialog(true)}
                        sx={{ mr: 2 }}
                    >
                        Nouveau livreur
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Nouvelle livraison
                    </Button>
                </Box>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <DeliveryIcon color="primary" sx={{ mr: 1 }} />
                                <Typography color="textSecondary">
                                    Livraisons en cours
                                </Typography>
                            </Box>
                            <Typography variant="h5">
                                {deliveries.filter(d => d.status === 'in_progress').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <TimerIcon color="primary" sx={{ mr: 1 }} />
                                <Typography color="textSecondary">
                                    Temps moyen de livraison
                                </Typography>
                            </Box>
                            <Typography variant="h5">
                                45 minutes
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PersonIcon color="primary" sx={{ mr: 1 }} />
                                <Typography color="textSecondary">
                                    Livreurs disponibles
                                </Typography>
                            </Box>
                            <Typography variant="h5">
                                {deliveryPersons.filter(p => p.status === 'available').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Drivers Management Section */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Gestion des livreurs</Typography>
                    <TextField
                        size="small"
                        label="Rechercher livreur"
                        variant="outlined"
                        value={driverSearchTerm}
                        onChange={(e) => setDriverSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon />,
                        }}
                        sx={{ width: 300 }}
                    />
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nom</TableCell>
                                <TableCell>Téléphone</TableCell>
                                <TableCell>Véhicule</TableCell>
                                <TableCell>Statut</TableCell>
                                <TableCell>Note</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDrivers.map((person) => (
                                <TableRow key={person.id}>
                                    <TableCell>{person.name}</TableCell>
                                    <TableCell>{person.phone}</TableCell>
                                    <TableCell>{person.vehicle}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getDriverStatusLabel(person.status)}
                                            color={getDriverStatusColor(person.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Rating 
                                            value={calculateDeliveryPersonRating(person.name)} 
                                            precision={0.5} 
                                            readOnly 
                                            size="small" 
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton 
                                            onClick={() => {
                                                setSelectedDriver(person);
                                                setOpenDriverDialog(true);
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDeleteDriver(person.id)}
                                            color="error"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Deliveries Section */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Livraisons
                </Typography>
                {/* Filters */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Rechercher"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon />,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Statut</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                label="Statut"
                            >
                                <MenuItem value="all">Tous</MenuItem>
                                <MenuItem value="pending">En attente</MenuItem>
                                <MenuItem value="in_progress">En cours</MenuItem>
                                <MenuItem value="completed">Terminé</MenuItem>
                                <MenuItem value="cancelled">Annulé</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Commande</TableCell>
                                <TableCell>Client</TableCell>
                                <TableCell>Adresse</TableCell>
                                <TableCell>Zone</TableCell>
                                <TableCell>Service</TableCell>
                                <TableCell>Livreur</TableCell>
                                <TableCell>Statut</TableCell>
                                <TableCell align="right">Frais</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDeliveries.map((delivery) => (
                                <TableRow key={delivery.id}>
                                    <TableCell>{delivery.orderId}</TableCell>
                                    <TableCell>{delivery.customer}</TableCell>
                                    <TableCell>{delivery.address}</TableCell>
                                    <TableCell>{delivery.zone}</TableCell>
                                    <TableCell>{delivery.service}</TableCell>
                                    <TableCell>{delivery.assignedTo}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={delivery.status}
                                            color={getStatusColor(delivery.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">{delivery.fee.toLocaleString()} GNF</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleOpenDialog(delivery)}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Delivery Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedDelivery ? 'Modifier la livraison' : 'Nouvelle livraison'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Numéro de commande"
                                value={selectedDelivery?.orderId || ''}
                                onChange={(e) => setSelectedDelivery({ ...selectedDelivery, orderId: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Client"
                                value={selectedDelivery?.customer || ''}
                                onChange={(e) => setSelectedDelivery({ ...selectedDelivery, customer: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Adresse"
                                value={selectedDelivery?.address || ''}
                                onChange={(e) => setSelectedDelivery({ ...selectedDelivery, address: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Zone de livraison</InputLabel>
                                <Select
                                    value={selectedDelivery?.zone || ''}
                                    onChange={(e) => setSelectedDelivery({ ...selectedDelivery, zone: e.target.value })}
                                    label="Zone de livraison"
                                >
                                    {deliveryZones.map((zone) => (
                                        <MenuItem key={zone.id} value={zone.name}>
                                            {zone.name} ({zone.fee.toLocaleString()} GNF)
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Service de livraison</InputLabel>
                                <Select
                                    value={selectedDelivery?.service || ''}
                                    onChange={(e) => setSelectedDelivery({ ...selectedDelivery, service: e.target.value })}
                                    label="Service de livraison"
                                >
                                    {deliveryServices.map((service) => (
                                        <MenuItem key={service.id} value={service.name}>
                                            {service.name} ({service.fee.toLocaleString()} GNF)
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Livreur</InputLabel>
                                <Select
                                    value={selectedDelivery?.assignedTo || ''}
                                    onChange={(e) => setSelectedDelivery({ ...selectedDelivery, assignedTo: e.target.value })}
                                    label="Livreur"
                                >
                                    {deliveryPersons
                                        .filter(person => person.status === 'available')
                                        .map((person) => (
                                            <MenuItem key={person.id} value={person.name}>
                                                {person.name} ({person.vehicle})
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Statut</InputLabel>
                                <Select
                                    value={selectedDelivery?.status || ''}
                                    onChange={(e) => setSelectedDelivery({ ...selectedDelivery, status: e.target.value })}
                                    label="Statut"
                                >
                                    <MenuItem value="pending">En attente</MenuItem>
                                    <MenuItem value="in_progress">En cours</MenuItem>
                                    <MenuItem value="completed">Terminé</MenuItem>
                                    <MenuItem value="cancelled">Annulé</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Annuler</Button>
                    <Button onClick={handleSaveDelivery} variant="contained">
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Driver Management Dialog */}
            <Dialog open={openDriverDialog} onClose={() => setOpenDriverDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedDriver ? 'Modifier livreur' : 'Ajouter un nouveau livreur'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nom complet"
                                value={selectedDriver?.name || newDriver.name}
                                onChange={(e) => selectedDriver 
                                    ? setSelectedDriver({...selectedDriver, name: e.target.value})
                                    : setNewDriver({...newDriver, name: e.target.value})
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Téléphone"
                                value={selectedDriver?.phone || newDriver.phone}
                                onChange={(e) => selectedDriver 
                                    ? setSelectedDriver({...selectedDriver, phone: e.target.value})
                                    : setNewDriver({...newDriver, phone: e.target.value})
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Véhicule</InputLabel>
                                <Select
                                    value={selectedDriver?.vehicle || newDriver.vehicle}
                                    onChange={(e) => selectedDriver 
                                        ? setSelectedDriver({...selectedDriver, vehicle: e.target.value})
                                        : setNewDriver({...newDriver, vehicle: e.target.value})
                                    }
                                    label="Véhicule"
                                >
                                    {vehicleTypes.map((vehicle) => (
                                        <MenuItem key={vehicle} value={vehicle}>{vehicle}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Statut</InputLabel>
                                <Select
                                    value={selectedDriver?.status || newDriver.status}
                                    onChange={(e) => selectedDriver 
                                        ? setSelectedDriver({...selectedDriver, status: e.target.value})
                                        : setNewDriver({...newDriver, status: e.target.value})
                                    }
                                    label="Statut"
                                >
                                    {driverStatuses.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {getDriverStatusLabel(status)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenDriverDialog(false);
                        setSelectedDriver(null);
                        setNewDriver({
                            name: '',
                            phone: '',
                            vehicle: 'Moto',
                            status: 'available'
                        });
                    }}>Annuler</Button>
                    <Button onClick={handleSaveDriver} variant="contained">
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Tabs for different sections */}
            <Paper sx={{ mt: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    variant="fullWidth"
                >
                    <Tab label="Livraisons" />
                    <Tab label="Suivi en temps réel" />
                    <Tab label="Notations" />
                    <Tab label="Performance" />
                </Tabs>

                {/* Real-time Tracking Tab */}
                {activeTab === 1 && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Suivi en temps réel des livreurs
                        </Typography>
                        <Grid container spacing={2}>
                            {Object.entries(trackingData).map(([person, data]) => (
                                <Grid item xs={12} sm={6} md={4} key={person}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <LocationIcon color="primary" sx={{ mr: 1 }} />
                                                <Typography variant="h6">{person}</Typography>
                                            </Box>
                                            <Typography>
                                                Dernière mise à jour: {data.lastUpdate.toLocaleTimeString()}
                                            </Typography>
                                            <Typography>
                                                Position: {data.lat.toFixed(4)}, {data.lng.toFixed(4)}
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Statut: {deliveryPersons.find(p => p.name === person)?.status}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Ratings Tab */}
                {activeTab === 2 && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Notations des livreurs
                        </Typography>
                        <Grid container spacing={2}>
                            {deliveryPersons.map((person) => (
                                <Grid item xs={12} sm={6} md={4} key={person.id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">{person.name}</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Rating
                                                    value={calculateDeliveryPersonRating(person.name)}
                                                    precision={0.5}
                                                    readOnly
                                                />
                                                <Typography sx={{ ml: 1 }}>
                                                    ({calculateDeliveryPersonRating(person.name).toFixed(1)})
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="textSecondary">
                                                {person.vehicle}
                                            </Typography>
                                            <Typography variant="body2">
                                                Livraisons effectuées: {
                                                    deliveries.filter(d => d.assignedTo === person.name).length
                                                }
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Performance Tab */}
                {activeTab === 3 && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Rapports de performance
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Temps moyen de livraison
                                        </Typography>
                                        <Typography variant="h4">
                                            {performanceMetrics.averageDeliveryTime} min
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Taux de livraison à temps
                                        </Typography>
                                        <Typography variant="h4">
                                            {performanceMetrics.onTimeDeliveryRate}%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Satisfaction client
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Rating value={performanceMetrics.customerSatisfaction} readOnly />
                                            <Typography variant="h6" sx={{ ml: 1 }}>
                                                {performanceMetrics.customerSatisfaction.toFixed(1)}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Taux de réussite
                                        </Typography>
                                        <Typography variant="h4">
                                            {performanceMetrics.deliverySuccessRate}%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Paper>

            {/* Add SMS Notification Settings Dialog */}
            <Dialog
                open={smsDialogOpen}
                onClose={() => setSmsDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Paramètres des notifications SMS</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={smsNotifications.enabled}
                                        onChange={(e) => setSmsNotifications({
                                            ...smsNotifications,
                                            enabled: e.target.checked
                                        })}
                                    />
                                }
                                label="Activer les notifications SMS"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={smsNotifications.statusUpdates}
                                        onChange={(e) => setSmsNotifications({
                                            ...smsNotifications,
                                            statusUpdates: e.target.checked
                                        })}
                                    />
                                }
                                label="Mises à jour de statut"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={smsNotifications.deliveryConfirmation}
                                        onChange={(e) => setSmsNotifications({
                                            ...smsNotifications,
                                            deliveryConfirmation: e.target.checked
                                        })}
                                    />
                                }
                                label="Confirmation de livraison"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={smsNotifications.delayAlerts}
                                        onChange={(e) => setSmsNotifications({
                                            ...smsNotifications,
                                            delayAlerts: e.target.checked
                                        })}
                                    />
                                }
                                label="Alertes de retard"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSmsDialogOpen(false)}>Fermer</Button>
                </DialogActions>
            </Dialog>

            {/* Add Voice Assistant Button */}
            <Box sx={{ position: 'fixed', bottom: 20, right: 20 }}>
                <Tooltip title="Assistant vocal">
                    <IconButton
                        color={isListening ? 'error' : 'primary'}
                        onClick={startVoiceRecognition}
                        sx={{
                            width: 64,
                            height: 64,
                            backgroundColor: isListening ? 'error.main' : 'primary.main',
                            '&:hover': {
                                backgroundColor: isListening ? 'error.dark' : 'primary.dark',
                            },
                        }}
                    >
                        {isListening ? <MicOffIcon /> : <MicIcon />}
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Add Voice Commands Dialog */}
            <Dialog
                open={showVoiceCommands}
                onClose={() => setShowVoiceCommands(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <HelpIcon sx={{ mr: 1 }} />
                        Commandes vocales disponibles
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle1" gutterBottom>
                        Commandes administrateur
                    </Typography>
                    <List>
                        {voiceCommands.map((cmd, index) => (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <ListItemIcon>
                                        <MicIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={cmd.command}
                                        secondary={cmd.description}
                                    />
                                </ListItem>
                                {index < voiceCommands.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                        Commandes livreur
                    </Typography>
                    <List>
                        {driverVoiceCommands.map((cmd, index) => (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <ListItemIcon>
                                        <DirectionsIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={cmd.command}
                                        secondary={cmd.description}
                                    />
                                </ListItem>
                                {index < driverVoiceCommands.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowVoiceCommands(false)}>Fermer</Button>
                </DialogActions>
            </Dialog>

            {/* Add Voice Recognition Status */}
            {isListening && (
                <Snackbar
                    open={isListening}
                    message="Écoute en cours..."
                    sx={{
                        '& .MuiSnackbarContent-root': {
                            backgroundColor: 'primary.main',
                        },
                    }}
                />
            )}

            {/* Add Recognized Command Display */}
            {recognizedText && (
                <Snackbar
                    open={!!recognizedText}
                    autoHideDuration={3000}
                    onClose={() => setRecognizedText('')}
                    message={`Commande reconnue: ${recognizedText}`}
                />
            )}

            {/* Add Voice History Dialog */}
            <Dialog
                open={showVoiceHistory}
                onClose={() => setShowVoiceHistory(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <HistoryIcon sx={{ mr: 1 }} />
                        Historique des commandes vocales
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date/Heure</TableCell>
                                    <TableCell>Utilisateur</TableCell>
                                    <TableCell>Commande</TableCell>
                                    <TableCell>Statut</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {voiceHistory.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell>
                                            {entry.timestamp.toLocaleString()}
                                        </TableCell>
                                        <TableCell>{entry.user}</TableCell>
                                        <TableCell>{entry.command}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={entry.success ? 'Succès' : 'Échec'}
                                                color={entry.success ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowVoiceHistory(false)}>Fermer</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Delivery;