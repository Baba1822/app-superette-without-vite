import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Search as SearchIcon
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
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';

// Mock data for delivery services
const deliveryServices = [
    {
        id: 1,
        name: 'Livraison Express',
        description: 'Livraison en moins de 30 minutes',
        price: 5000,
        estimatedTime: '30 minutes'
    },
    {
        id: 2,
        name: 'Livraison Standard',
        description: 'Livraison en moins de 1 heure',
        price: 3000,
        estimatedTime: '1 heure'
    },
    {
        id: 3,
        name: 'Livraison Économique',
        description: 'Livraison en moins de 2 heures',
        price: 2000,
        estimatedTime: '2 heures'
    }
];

// Mock data for delivery zones
const deliveryZones = [
    { id: 1, name: 'Zone 1', description: 'Centre-ville' },
    { id: 2, name: 'Zone 2', description: 'Périphérie' },
    { id: 3, name: 'Zone 3', description: 'Banlieue' }
];

// Mock data for delivery persons
const initialDeliveryPersons = [
    {
        id: 1,
        name: 'Mamadou Diallo',
        phone: '224622123456',
        email: 'mamadou@superette.com',
        status: 'Disponible',
        username: 'mamadou123',
        password: 'password123'
    },
    {
        id: 2,
        name: 'Fatoumata Bamba',
        phone: '224633987654',
        email: 'fatou@superette.com',
        status: 'Disponible',
        username: 'fatou456',
        password: 'password456'
    }
];

// Mock data for deliveries
const initialDeliveries = [
    {
        id: 1,
        orderNumber: 'ORD-001',
        customer: 'Client A',
        address: '123 Rue de la Paix',
        zone: 'Zone 1',
        service: 'Livraison Express',
        deliveryPerson: 'Mamadou Diallo',
        status: 'en instance',
        fee: 5000,
        estimatedTime: '30 minutes',
        actualTime: null
    },
    {
        id: 2,
        orderNumber: 'ORD-002',
        customer: 'Client B',
        address: '456, avenue de la Liberté',
        zone: 'Zone 2',
        service: 'Livraison Standard',
        deliveryPerson: 'Fatoumata Bamba',
        status: 'in_progress',
        fee: 3000,
        estimatedTime: '1 heure',
        actualTime: '45 minutes'
    },
    {
        id: 3,
        orderNumber: 'ORD-003',
        customer: 'Client C',
        address: '789 Boulevard de la République',
        zone: 'Zone 3',
        service: 'Livraison Économique',
        deliveryPerson: 'Ibrahima Koné',
        status: 'terminé',
        fee: 2000,
        estimatedTime: '2 heures',
        actualTime: '1 heure 30 minutes'
    }
];

// Fonction pour générer un mot de passe aléatoire
const generatePassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};

// Fonction pour générer un nom d'utilisateur basé sur le nom
const generateUsername = (name) => {
    return `${name.toLowerCase().replace(/\s+/g, '')}${Math.floor(Math.random() * 1000)}`;
};

// Fonction pour envoyer un SMS avec Twilio
const sendCredentialsSMS = async (phone, username, password) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/send-sms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: phone,
                body: `Bonjour,\n\nVoici vos identifiants de connexion livreur :\n\nNom d'utilisateur : ${username}\nMot de passe : ${password}\n\nNous vous conseillons de changer votre mot de passe après votre première connexion.\n\nCordialement,\nL'équipe de la superette`
            })
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi du SMS');
        }

        return true;
    } catch (error) {
        console.error('Erreur lors de l\'envoi du SMS:', error);
        return false;
    }
};

function DeliveryService() {
    const [deliveries, setDeliveries] = useState(initialDeliveries);
    const [deliveryPersons, setDeliveryPersons] = useState(initialDeliveryPersons);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeliveryPersonDialog, setOpenDeliveryPersonDialog] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        status: 'Disponible'
    });
    const [errors, setErrors] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Calcul des statistiques
    const ongoingDeliveries = deliveries.filter(d => d.status === 'in_progress').length;
    const averageDeliveryTime = deliveries
        .filter(d => d.actualTime)
        .reduce((acc, d) => {
            const time = parseInt(d.actualTime);
            return acc + time;
        }, 0) / deliveries.filter(d => d.actualTime).length;
    const availableDeliveryPersons = deliveryPersons.filter(dp => dp.status === 'Disponible').length;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenDeliveryPersonDialog = (deliveryPerson = null) => {
        if (deliveryPerson) {
            setSelectedDeliveryPerson(deliveryPerson);
            setFormData({
                name: deliveryPerson.name,
                phone: deliveryPerson.phone,
                email: deliveryPerson.email,
                status: deliveryPerson.status
            });
        } else {
            setSelectedDeliveryPerson(null);
            setFormData({
                name: '',
                phone: '',
                email: '',
                status: 'Disponible'
            });
        }
        setErrors({
            name: '',
            phone: '',
            email: ''
        });
        setOpenDeliveryPersonDialog(true);
    };

    const handleCloseDeliveryPersonDialog = () => {
        setOpenDeliveryPersonDialog(false);
        setSelectedDeliveryPerson(null);
        setFormData({
            name: '',
            phone: '',
            email: '',
            status: 'Disponible'
        });
        setErrors({
            name: '',
            phone: '',
            email: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: '',
            phone: '',
            email: ''
        };

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est requis';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Veuillez entrer une adresse email valide';
            isValid = false;
        }

        // Validation du numéro de téléphone guinéen
        const phoneRegex = /^224[678]\d{8}$/;
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Le numéro de téléphone doit commencer par 224 suivi de 8 chiffres (commençant par 6, 7 ou 8)';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmitDeliveryPerson = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        if (selectedDeliveryPerson) {
            setDeliveryPersons(deliveryPersons.map(dp => 
                dp.id === selectedDeliveryPerson.id ? { ...formData, id: dp.id, username: dp.username, password: dp.password } : dp
            ));
        } else {
            const username = generateUsername(formData.name);
            const password = generatePassword();
            
            const smsSent = await sendCredentialsSMS(formData.phone, username, password);
            
            if (smsSent) {
                const newDeliveryPerson = {
                    ...formData,
                    id: Date.now(),
                    username,
                    password
                };
                setDeliveryPersons([...deliveryPersons, newDeliveryPerson]);
                setSnackbar({
                    open: true,
                    message: 'Livreur ajouté avec succès. Les identifiants ont été envoyés par SMS.',
                    severity: 'success'
                });
            } else {
                setSnackbar({
                    open: true,
                    message: 'Erreur lors de l\'envoi des identifiants par SMS.',
                    severity: 'error'
                });
                return;
            }
        }
        handleCloseDeliveryPersonDialog();
    };

    const handleDeleteDeliveryPerson = (id) => {
        setDeliveryPersons(deliveryPersons.filter(dp => dp.id !== id));
    };

    const handleResendCredentials = async (deliveryPerson) => {
        const smsSent = await sendCredentialsSMS(deliveryPerson.phone, deliveryPerson.username, deliveryPerson.password);
        
        if (smsSent) {
            setSnackbar({
                open: true,
                message: 'Identifiants renvoyés avec succès.',
                severity: 'success'
            });
        } else {
            setSnackbar({
                open: true,
                message: 'Erreur lors de l\'envoi des identifiants.',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const filteredDeliveries = deliveries.filter(delivery =>
        (delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'all' || delivery.status === statusFilter)
    );

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">
                    Service de livraison
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDeliveryPersonDialog()}
                >
                    Nouveau livreur
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Livraisons en cours
                            </Typography>
                            <Typography variant="h5">
                                {ongoingDeliveries}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Temps moyen de livraison
                            </Typography>
                            <Typography variant="h5">
                                {averageDeliveryTime ? `${averageDeliveryTime} minutes` : 'N/A'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Livreurs disponibles
                            </Typography>
                            <Typography variant="h5">
                                {availableDeliveryPersons}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Statut</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                label="Statut"
                            >
                                <MenuItem value="all">Tous</MenuItem>
                                <MenuItem value="en instance">En instance</MenuItem>
                                <MenuItem value="in_progress">En cours</MenuItem>
                                <MenuItem value="terminé">Terminé</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper}>
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
                            <TableCell>Frais</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDeliveries
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((delivery) => (
                                <TableRow key={delivery.id}>
                                    <TableCell>{delivery.orderNumber}</TableCell>
                                    <TableCell>{delivery.customer}</TableCell>
                                    <TableCell>{delivery.address}</TableCell>
                                    <TableCell>{delivery.zone}</TableCell>
                                    <TableCell>{delivery.service}</TableCell>
                                    <TableCell>{delivery.deliveryPerson}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={delivery.status}
                                            color={
                                                delivery.status === 'terminé' ? 'success' :
                                                delivery.status === 'in_progress' ? 'primary' :
                                                'default'
                                            }
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{delivery.fee.toLocaleString()} GNF</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenDialog(delivery)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteDelivery(delivery.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredDeliveries.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <DeliveryPersonDialog
                open={openDeliveryPersonDialog}
                onClose={handleCloseDeliveryPersonDialog}
                onSave={handleSubmitDeliveryPerson}
                deliveryPerson={selectedDeliveryPerson}
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

function DeliveryPersonDialog({ open, onClose, onSave, deliveryPerson, formData, errors, onInputChange }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {deliveryPerson ? 'Modifier le livreur' : 'Nouveau livreur'}
            </DialogTitle>
            <form onSubmit={onSave}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nom complet"
                                name="name"
                                value={formData.name}
                                onChange={onInputChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={onInputChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Téléphone"
                                name="phone"
                                value={formData.phone}
                                onChange={onInputChange}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                placeholder="224XXXXXXXX"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Statut</InputLabel>
                                <Select
                                    name="status"
                                    value={formData.status}
                                    onChange={onInputChange}
                                    label="Statut"
                                >
                                    <MenuItem value="Disponible">Disponible</MenuItem>
                                    <MenuItem value="Occupé">Occupé</MenuItem>
                                    <MenuItem value="En congé">En congé</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Annuler</Button>
                    <Button type="submit" variant="contained">
                        {deliveryPerson ? 'Modifier' : 'Ajouter'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default DeliveryService; 