import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    MenuItem,
    Snackbar,
    Alert,
    CircularProgress,
    Avatar,
    TablePagination
} from '@mui/material';
import {
    LocalShipping as DeliveryIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Print as PrintIcon,
    Notifications as NotifyIcon,
    LocationOn as LocationIcon,
    History as HistoryIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import { DeliveryService } from '../../../services/DeliveryService';

const DELIVERY_STATUS = {
    PENDING: { label: 'En attente', color: 'warning' },
    ASSIGNED: { label: 'Assignée', color: 'info' },
    IN_TRANSIT: { label: 'En cours', color: 'primary' },
    DELIVERED: { label: 'Livrée', color: 'success' },
    FAILED: { label: 'Échouée', color: 'error' }
};

const DeliveryManagement = () => {
    // États du composant
    const [couriers, setCouriers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCourier, setSelectedCourier] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        status: 'active',
        avatarUrl: ''
    });
    // Recherche, filtre, pagination
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    // Historique d'activité
    const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [historyCourier, setHistoryCourier] = useState(null);

    useEffect(() => {
        loadCouriers();
    }, []);

    // Charger les livreurs
    const loadCouriers = async () => {
        try {
            setLoading(true);
            const response = await DeliveryService.getAllCouriers();
            setCouriers(response);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Erreur lors du chargement des livreurs',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (courier = null) => {
        if (courier) {
            setSelectedCourier(courier);
            setFormData({
                name: courier.name,
                phone: courier.phone,
                email: courier.email,
                status: courier.status || 'active',
                avatarUrl: courier.avatarUrl || ''
            });
        } else {
            setSelectedCourier(null);
            setFormData({ name: '', phone: '', email: '', status: 'active', avatarUrl: '' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCourier(null);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (selectedCourier) {
                await DeliveryService.updateCourier(selectedCourier.id, formData);
                setSnackbar({ open: true, message: 'Livreur modifié avec succès', severity: 'success' });
            } else {
                await DeliveryService.createCourier(formData);
                setSnackbar({ open: true, message: 'Livreur ajouté avec succès', severity: 'success' });
            }
            handleCloseDialog();
            loadCouriers();
        } catch (error) {
            setSnackbar({ open: true, message: 'Erreur lors de l\'enregistrement du livreur', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courierId) => {
        if (!window.confirm('Supprimer ce livreur ?')) return;
        try {
            setLoading(true);
            await DeliveryService.deleteCourier(courierId);
            setSnackbar({ open: true, message: 'Livreur supprimé', severity: 'success' });
            loadCouriers();
        } catch (error) {
            setSnackbar({ open: true, message: 'Erreur lors de la suppression', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Recherche, filtre, pagination
    const filteredCouriers = couriers.filter(courier =>
        (statusFilter === 'all' || courier.status === statusFilter) &&
        (
            courier.name.toLowerCase().includes(search.toLowerCase()) ||
            courier.phone.includes(search) ||
            courier.email.toLowerCase().includes(search.toLowerCase())
        )
    );
    const paginatedCouriers = filteredCouriers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Export CSV
    const handleExportCSV = () => {
        const headers = ['Nom', 'Téléphone', 'Email', 'Statut', 'Livraisons effectuées'];
        const rows = filteredCouriers.map(c => [c.name, c.phone, c.email, c.status, c.deliveriesCount || 0]);
        let csvContent = 'data:text/csv;charset=utf-8,'
            + headers.join(',') + '\n'
            + rows.map(e => e.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'livreurs.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Historique d'activité
    const handleShowHistory = async (courier) => {
        setHistoryDialogOpen(true);
        setHistoryCourier(courier);
        setHistoryLoading(true);
        try {
            const data = await DeliveryService.getCourierHistory(courier.id); // À implémenter côté service/API
            setHistoryData(data);
        } catch (error) {
            setHistoryData([]);
        } finally {
            setHistoryLoading(false);
        }
    };
    const handleCloseHistory = () => {
        setHistoryDialogOpen(false);
        setHistoryData([]);
        setHistoryCourier(null);
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Gestion des Livreurs</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={handleExportCSV}
                    >
                        Exporter CSV
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Ajouter un livreur
                    </Button>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    label="Rechercher"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    size="small"
                />
                <TextField
                    select
                    label="Statut"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    size="small"
                    sx={{ minWidth: 120 }}
                >
                    <MenuItem value="all">Tous</MenuItem>
                    <MenuItem value="active">Actif</MenuItem>
                    <MenuItem value="inactive">Inactif</MenuItem>
                    <MenuItem value="on_leave">En congé</MenuItem>
                </TextField>
            </Box>
            {loading && <CircularProgress />}
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Avatar</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Téléphone</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell>Livraisons effectuées</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedCouriers.map((courier) => (
                            <TableRow key={courier.id}>
                                <TableCell>
                                    <Avatar src={courier.avatarUrl}>{courier.name ? courier.name[0] : '?'}</Avatar>
                                </TableCell>
                                <TableCell>{courier.name}</TableCell>
                                <TableCell>{courier.phone}</TableCell>
                                <TableCell>{courier.email}</TableCell>
                                <TableCell>{courier.status}</TableCell>
                                <TableCell>{courier.deliveriesCount || 0}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog(courier)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(courier.id)}><DeleteIcon /></IconButton>
                                    <IconButton onClick={() => handleShowHistory(courier)}><HistoryIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={filteredCouriers.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{selectedCourier ? 'Modifier le livreur' : 'Ajouter un livreur'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nom"
                        fullWidth
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Téléphone"
                        fullWidth
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Statut"
                        fullWidth
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="URL de l'avatar (optionnel)"
                        fullWidth
                        value={formData.avatarUrl}
                        onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Annuler</Button>
                    <Button onClick={handleSubmit} variant="contained">{selectedCourier ? 'Modifier' : 'Ajouter'}</Button>
                </DialogActions>
            </Dialog>
            {/* Historique d'activité */}
            <Dialog open={historyDialogOpen} onClose={handleCloseHistory} maxWidth="md" fullWidth>
                <DialogTitle>Historique de {historyCourier?.name}</DialogTitle>
                <DialogContent>
                    {historyLoading ? (
                        <CircularProgress />
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Client</TableCell>
                                    <TableCell>Adresse</TableCell>
                                    <TableCell>Statut</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {historyData.length === 0 ? (
                                    <TableRow><TableCell colSpan={4}>Aucune livraison</TableCell></TableRow>
                                ) : (
                                    historyData.map((delivery, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{delivery.date}</TableCell>
                                            <TableCell>{delivery.customerName}</TableCell>
                                            <TableCell>{delivery.deliveryAddress}</TableCell>
                                            <TableCell>{delivery.status}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseHistory}>Fermer</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default DeliveryManagement; 