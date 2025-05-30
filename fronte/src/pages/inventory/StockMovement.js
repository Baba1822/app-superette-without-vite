import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Grid,
    TextField,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Fab,
    Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    Add as AddIcon,
    FileDownload as ExportIcon,
    ArrowUpward as InIcon,
    ArrowDownward as OutIcon
} from '@mui/icons-material';

const StockMovement = () => {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [filters, setFilters] = useState({
        startDate: null,
        endDate: null,
        type: 'all',
        product: 'all'
    });
    const [formData, setFormData] = useState({
        date: new Date(),
        type: 'in',
        product: '',
        quantity: '',
        reason: '',
        notes: ''
    });

    const movementTypes = [
        { value: 'all', label: 'Tous les types' },
        { value: 'in', label: 'Entrée' },
        { value: 'out', label: 'Sortie' }
    ];

    const products = [
        { value: 'all', label: 'Tous les produits' },
        { value: 'rice', label: 'Riz local' },
        { value: 'oil', label: 'Huile végétale' },
        { value: 'soap', label: 'Savon' }
    ];

    const reasons = {
        in: [
            { value: 'purchase', label: 'Achat' },
            { value: 'return', label: 'Retour' },
            { value: 'adjustment', label: 'Ajustement' }
        ],
        out: [
            { value: 'sale', label: 'Vente' },
            { value: 'damage', label: 'Dommage' },
            { value: 'expired', label: 'Périmé' },
            { value: 'adjustment', label: 'Ajustement' }
        ]
    };

    useEffect(() => {
        const fetchMovements = async () => {
            try {
                // Simuler un appel API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Données mockées
                const mockMovements = [
                    {
                        id: '1',
                        date: '2024-03-10',
                        type: 'in',
                        product: 'rice',
                        quantity: 100,
                        reason: 'purchase',
                        notes: 'Livraison fournisseur ABC'
                    },
                    {
                        id: '2',
                        date: '2024-03-09',
                        type: 'out',
                        product: 'oil',
                        quantity: 50,
                        reason: 'sale',
                        notes: 'Vente client XYZ'
                    }
                ];

                setMovements(mockMovements);
            } catch (err) {
                setError('Erreur lors du chargement des mouvements');
            } finally {
                setLoading(false);
            }
        };

        fetchMovements();
    }, []);

    const handleAdd = () => {
        setFormData({
            date: new Date(),
            type: 'in',
            product: '',
            quantity: '',
            reason: '',
            notes: ''
        });
        setOpenDialog(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // TODO: Implémenter la sauvegarde
            const newMovement = {
                id: Date.now().toString(),
                ...formData,
                quantity: parseInt(formData.quantity)
            };

            setMovements(prev => [...prev, newMovement]);
            setOpenDialog(false);
        } catch (err) {
            setError('Erreur lors de la sauvegarde');
        }
    };

    const handleExport = () => {
        // TODO: Implémenter l'export
        console.log('Export des mouvements');
    };

    const getProductLabel = (productValue) => {
        const product = products.find(p => p.value === productValue);
        return product ? product.label : productValue;
    };

    const getReasonLabel = (type, reasonValue) => {
        const reason = reasons[type].find(r => r.value === reasonValue);
        return reason ? reason.label : reasonValue;
    };

    const filteredMovements = movements
        .filter(movement => {
            if (filters.type !== 'all' && movement.type !== filters.type) return false;
            if (filters.product !== 'all' && movement.product !== filters.product) return false;
            if (filters.startDate && new Date(movement.date) < filters.startDate) return false;
            if (filters.endDate && new Date(movement.date) > filters.endDate) return false;
            return true;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Mouvements de Stock
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Filtres */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Date début"
                                    value={filters.startDate}
                                    onChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Date fin"
                                    value={filters.endDate}
                                    onChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField
                                select
                                fullWidth
                                label="Type"
                                value={filters.type}
                                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                            >
                                {movementTypes.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                        {type.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField
                                select
                                fullWidth
                                label="Produit"
                                value={filters.product}
                                onChange={(e) => setFilters(prev => ({ ...prev, product: e.target.value }))}
                            >
                                {products.map((product) => (
                                    <MenuItem key={product.value} value={product.value}>
                                        {product.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                variant="contained"
                                startIcon={<ExportIcon />}
                                onClick={handleExport}
                                fullWidth
                            >
                                Exporter
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Liste des mouvements */}
            <Card>
                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Produit</TableCell>
                                    <TableCell align="right">Quantité</TableCell>
                                    <TableCell>Motif</TableCell>
                                    <TableCell>Notes</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredMovements.map((movement) => (
                                    <TableRow key={movement.id}>
                                        <TableCell>
                                            {new Date(movement.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={movement.type === 'in' ? <InIcon /> : <OutIcon />}
                                                label={movement.type === 'in' ? 'Entrée' : 'Sortie'}
                                                color={movement.type === 'in' ? 'success' : 'error'}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {getProductLabel(movement.product)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {movement.quantity}
                                        </TableCell>
                                        <TableCell>
                                            {getReasonLabel(movement.type, movement.reason)}
                                        </TableCell>
                                        <TableCell>{movement.notes}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Bouton d'ajout */}
            <Fab
                color="primary"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={handleAdd}
            >
                <AddIcon />
            </Fab>

            {/* Modal d'ajout */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        Nouveau Mouvement
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Date"
                                        value={formData.date}
                                        onChange={(date) => setFormData(prev => ({ ...prev, date }))}
                                        renderInput={(params) => <TextField {...params} fullWidth required />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Type"
                                    value={formData.type}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                    required
                                >
                                    <MenuItem value="in">Entrée</MenuItem>
                                    <MenuItem value="out">Sortie</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Produit"
                                    value={formData.product}
                                    onChange={(e) => setFormData(prev => ({ ...prev, product: e.target.value }))}
                                    required
                                >
                                    {products.slice(1).map((product) => (
                                        <MenuItem key={product.value} value={product.value}>
                                            {product.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Quantité"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Motif"
                                    value={formData.reason}
                                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                                    required
                                >
                                    {reasons[formData.type].map((reason) => (
                                        <MenuItem key={reason.value} value={reason.value}>
                                            {reason.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Notes"
                                    value={formData.notes}
                                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" variant="contained">
                            Ajouter
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default StockMovement; 