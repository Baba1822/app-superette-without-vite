import {
    Add as AddIcon,
    BarChart as BarChartIcon,
    Edit as EditIcon,
    PieChart as PieChartIcon,
    Timeline as TimelineIcon
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
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
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
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

// Mock data for customer profiles
const customerProfiles = [
    {
        id: 1,
        name: 'John Doe',
        age: 35,
        gender: 'Male',
        preferences: ['Electronics', 'Sports'],
        purchaseHistory: [
            { product: 'Laptop', amount: 1200, date: '2023-01-15' },
            { product: 'Headphones', amount: 200, date: '2023-02-20' }
        ],
        lastVisit: '2023-03-10'
    },
    {
        id: 2,
        name: 'Client B',
        phone: '623456789',
        purchaseHistory: [
            { date: '2024-03-02', amount: 200000, category: 'Mobilier' },
            { date: '2024-03-10', amount: 100000, category: 'Décoration' },
        ],
        preferences: ['Mobilier', 'Décoration'],
        lastVisit: '2024-03-14',
        loyaltyPoints: 750,
    },
];

// Mock data for available offers
const availableOffers = [
    {
        id: 1,
        name: 'Réduction Électronique',
        description: '20% de réduction sur tous les produits électroniques',
        category: 'Électronique',
        discount: 20,
        minPurchase: 100000,
        validUntil: '2024-03-31',
        targetCustomers: ['Client A'],
    },
    {
        id: 2,
        name: 'Offre Mobilier',
        description: '15% de réduction sur le mobilier',
        category: 'Mobilier',
        discount: 15,
        minPurchase: 150000,
        validUntil: '2024-03-31',
        targetCustomers: ['Client B'],
    },
];

// Mock data for real-time store visitors
const storeVisitors = [
    {
        id: 1,
        customerId: 1,
        name: 'Client A',
        entryTime: new Date(),
        currentLocation: 'Électronique',
        browsingHistory: ['Électronique', 'Vêtements'],
    },
];

function Offers() {
    const [activeTab, setActiveTab] = useState(0);
    const [offers, setOffers] = useState(availableOffers);
    const [visitors, setVisitors] = useState(storeVisitors);
    const [showOfferDialog, setShowOfferDialog] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });
    const [notificationSettings, setNotificationSettings] = useState({
        enabled: true,
        sms: true,
        push: true,
        email: true,
    });

    // Function to check for personalized offers
    const checkPersonalizedOffers = (customer) => {
        const customerOffers = offers.filter(offer => 
            offer.targetCustomers.includes(customer.name) &&
            new Date(offer.validUntil) > new Date()
        );
        
        return customerOffers.map(offer => ({
            ...offer,
            relevance: calculateOfferRelevance(offer, customer),
        })).sort((a, b) => b.relevance - a.relevance);
    };

    // Function to calculate offer relevance
    const calculateOfferRelevance = (offer, customer) => {
        let relevance = 0;
        
        // Check if offer category matches customer preferences
        if (customer.preferences.includes(offer.category)) {
            relevance += 30;
        }
        
        // Check purchase history
        const categoryPurchases = customer.purchaseHistory
            .filter(p => p.category === offer.category)
            .reduce((sum, p) => sum + p.amount, 0);
        
        if (categoryPurchases > offer.minPurchase) {
            relevance += 20;
        }
        
        // Check loyalty points
        if (customer.loyaltyPoints > 500) {
            relevance += 10;
        }
        
        // Check last visit
        const daysSinceLastVisit = Math.floor(
            (new Date() - new Date(customer.lastVisit)) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSinceLastVisit < 7) {
            relevance += 10;
        }
        
        return relevance;
    };

    // Function to send offer notification
    const sendOfferNotification = (customer, offer) => {
        const message = `Offre spéciale pour vous ! ${offer.description}. Valable jusqu'au ${offer.validUntil}`;
        
        if (notificationSettings.sms) {
            // Implement SMS sending
            console.log(`Sending SMS to ${customer.phone}: ${message}`);
        }
        
        if (notificationSettings.push) {
            // Implement push notification
            console.log(`Sending push notification: ${message}`);
        }
        
        if (notificationSettings.email) {
            // Implement email sending
            console.log(`Sending email: ${message}`);
        }
        
        setSnackbar({
            open: true,
            message: 'Offre envoyée au client',
            severity: 'success',
        });
    };

    // Function to handle visitor entry
    const handleVisitorEntry = (customer) => {
        const personalizedOffers = checkPersonalizedOffers(customer);
        
        if (personalizedOffers.length > 0) {
            // Send the most relevant offer
            sendOfferNotification(customer, personalizedOffers[0]);
        }
    };

    // Simulate real-time visitor tracking
    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate new visitor entry
            if (Math.random() > 0.7) {
                const randomCustomer = customerProfiles[Math.floor(Math.random() * customerProfiles.length)];
                handleVisitorEntry(randomCustomer);
            }
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Offres personnalisées</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowOfferDialog(true)}
                >
                    Nouvelle offre
                </Button>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <BarChartIcon color="primary" sx={{ mr: 1 }} />
                                <Typography color="textSecondary">
                                    Offres actives
                                </Typography>
                            </Box>
                            <Typography variant="h5">
                                {offers.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <TimelineIcon color="primary" sx={{ mr: 1 }} />
                                <Typography color="textSecondary">
                                    Clients dans le magasin
                                </Typography>
                            </Box>
                            <Typography variant="h5">
                                {visitors.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PieChartIcon color="primary" sx={{ mr: 1 }} />
                                <Typography color="textSecondary">
                                    Offres envoyées aujourd'hui
                                </Typography>
                            </Box>
                            <Typography variant="h5">
                                12
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ mt: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    variant="fullWidth"
                >
                    <Tab label="Offres actives" />
                    <Tab label="Clients en magasin" />
                    <Tab label="Statistiques" />
                </Tabs>

                {/* Active Offers Tab */}
                {activeTab === 0 && (
                    <Box sx={{ p: 3 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nom</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Catégorie</TableCell>
                                        <TableCell>Réduction</TableCell>
                                        <TableCell>Validité</TableCell>
                                        <TableCell>Clients cibles</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {offers.map((offer) => (
                                        <TableRow key={offer.id}>
                                            <TableCell>{offer.name}</TableCell>
                                            <TableCell>{offer.description}</TableCell>
                                            <TableCell>{offer.category}</TableCell>
                                            <TableCell>{offer.discount}%</TableCell>
                                            <TableCell>{offer.validUntil}</TableCell>
                                            <TableCell>
                                                {offer.targetCustomers.map((customer, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={customer}
                                                        size="small"
                                                        sx={{ mr: 1 }}
                                                    />
                                                ))}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => {
                                                    setSelectedOffer(offer);
                                                    setShowOfferDialog(true);
                                                }}>
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Store Visitors Tab */}
                {activeTab === 1 && (
                    <Box sx={{ p: 3 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Client</TableCell>
                                        <TableCell>Heure d'entrée</TableCell>
                                        <TableCell>Emplacement actuel</TableCell>
                                        <TableCell>Historique de navigation</TableCell>
                                        <TableCell>Offres pertinentes</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visitors.map((visitor) => {
                                        const customer = customerProfiles.find(c => c.id === visitor.customerId);
                                        const personalizedOffers = checkPersonalizedOffers(customer);
                                        
                                        return (
                                            <TableRow key={visitor.id}>
                                                <TableCell>{visitor.name}</TableCell>
                                                <TableCell>
                                                    {visitor.entryTime.toLocaleTimeString()}
                                                </TableCell>
                                                <TableCell>{visitor.currentLocation}</TableCell>
                                                <TableCell>
                                                    {visitor.browsingHistory.map((item, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={item}
                                                            size="small"
                                                            sx={{ mr: 1 }}
                                                        />
                                                    ))}
                                                </TableCell>
                                                <TableCell>
                                                    {personalizedOffers.slice(0, 2).map((offer, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={`${offer.discount}% ${offer.category}`}
                                                            color="primary"
                                                            size="small"
                                                            sx={{ mr: 1 }}
                                                        />
                                                    ))}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => {
                                                            if (personalizedOffers.length > 0) {
                                                                sendOfferNotification(customer, personalizedOffers[0]);
                                                            }
                                                        }}
                                                    >
                                                        Envoyer offre
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Statistics Tab */}
                {activeTab === 2 && (
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Taux de conversion
                                        </Typography>
                                        <Typography variant="h4">
                                            25%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Panier moyen
                                        </Typography>
                                        <Typography variant="h4">
                                            150,000 GNF
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Offres acceptées
                                        </Typography>
                                        <Typography variant="h4">
                                            45%
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
                                        <Typography variant="h4">
                                            4.5/5
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Paper>

            {/* Offer Dialog */}
            <Dialog
                open={showOfferDialog}
                onClose={() => {
                    setShowOfferDialog(false);
                    setSelectedOffer(null);
                }}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedOffer ? 'Modifier l\'offre' : 'Nouvelle offre'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nom de l'offre"
                                value={selectedOffer?.name || ''}
                                onChange={(e) => setSelectedOffer({ ...selectedOffer, name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={selectedOffer?.description || ''}
                                onChange={(e) => setSelectedOffer({ ...selectedOffer, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Catégorie</InputLabel>
                                <Select
                                    value={selectedOffer?.category || ''}
                                    onChange={(e) => setSelectedOffer({ ...selectedOffer, category: e.target.value })}
                                    label="Catégorie"
                                >
                                    <MenuItem value="Électronique">Électronique</MenuItem>
                                    <MenuItem value="Vêtements">Vêtements</MenuItem>
                                    <MenuItem value="Mobilier">Mobilier</MenuItem>
                                    <MenuItem value="Décoration">Décoration</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Réduction (%)"
                                type="number"
                                value={selectedOffer?.discount || ''}
                                onChange={(e) => setSelectedOffer({ ...selectedOffer, discount: parseInt(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Achat minimum (GNF)"
                                type="number"
                                value={selectedOffer?.minPurchase || ''}
                                onChange={(e) => setSelectedOffer({ ...selectedOffer, minPurchase: parseInt(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Validité"
                                type="date"
                                value={selectedOffer?.validUntil || ''}
                                onChange={(e) => setSelectedOffer({ ...selectedOffer, validUntil: e.target.value })}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Clients cibles</InputLabel>
                                <Select
                                    multiple
                                    value={selectedOffer?.targetCustomers || []}
                                    onChange={(e) => setSelectedOffer({ ...selectedOffer, targetCustomers: e.target.value })}
                                    label="Clients cibles"
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {customerProfiles.map((customer) => (
                                        <MenuItem key={customer.id} value={customer.name}>
                                            {customer.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowOfferDialog(false);
                        setSelectedOffer(null);
                    }}>
                        Annuler
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (selectedOffer) {
                                // Update existing offer
                                setOffers(offers.map(o => 
                                    o.id === selectedOffer.id ? selectedOffer : o
                                ));
                            } else {
                                // Add new offer
                                setOffers([...offers, {
                                    ...selectedOffer,
                                    id: offers.length + 1,
                                }]);
                            }
                            setShowOfferDialog(false);
                            setSelectedOffer(null);
                        }}
                    >
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Settings Dialog */}
            <Dialog
                open={false}
                onClose={() => {}}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Paramètres des notifications</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.enabled}
                                        onChange={(e) => setNotificationSettings({
                                            ...notificationSettings,
                                            enabled: e.target.checked
                                        })}
                                    />
                                }
                                label="Activer les notifications"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.sms}
                                        onChange={(e) => setNotificationSettings({
                                            ...notificationSettings,
                                            sms: e.target.checked
                                        })}
                                    />
                                }
                                label="Notifications SMS"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.push}
                                        onChange={(e) => setNotificationSettings({
                                            ...notificationSettings,
                                            push: e.target.checked
                                        })}
                                    />
                                }
                                label="Notifications push"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.email}
                                        onChange={(e) => setNotificationSettings({
                                            ...notificationSettings,
                                            email: e.target.checked
                                        })}
                                    />
                                }
                                label="Notifications email"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {}}>Fermer</Button>
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

export default Offers; 