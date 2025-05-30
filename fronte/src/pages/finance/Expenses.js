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
    Fab
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    FileDownload as ExportIcon
} from '@mui/icons-material';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [filters, setFilters] = useState({
        startDate: null,
        endDate: null,
        category: 'all'
    });

    const [formData, setFormData] = useState({
        date: new Date(),
        amount: '',
        category: '',
        description: ''
    });

    const categories = [
        { value: 'utilities', label: 'Utilities' },
        { value: 'rent', label: 'Loyer' },
        { value: 'salary', label: 'Salaires' },
        { value: 'supplies', label: 'Fournitures' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'other', label: 'Autres' }
    ];

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                // Simuler un appel API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Données mockées
                const mockExpenses = [
                    {
                        id: '1',
                        date: '2024-03-10',
                        amount: 500000,
                        category: 'utilities',
                        description: 'Facture d\'électricité'
                    },
                    {
                        id: '2',
                        date: '2024-03-09',
                        amount: 1000000,
                        category: 'rent',
                        description: 'Loyer mensuel'
                    }
                ];

                setExpenses(mockExpenses);
            } catch (err) {
                setError('Erreur lors du chargement des dépenses');
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    const handleAdd = () => {
        setSelectedExpense(null);
        setFormData({
            date: new Date(),
            amount: '',
            category: '',
            description: ''
        });
        setOpenDialog(true);
    };

    const handleEdit = (expense) => {
        setSelectedExpense(expense);
        setFormData({
            date: new Date(expense.date),
            amount: expense.amount.toString(),
            category: expense.category,
            description: expense.description
        });
        setOpenDialog(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
            try {
                // TODO: Implémenter la suppression
                console.log('Suppression de la dépense:', id);
                setExpenses(prev => prev.filter(expense => expense.id !== id));
            } catch (err) {
                setError('Erreur lors de la suppression');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // TODO: Implémenter la sauvegarde
            const newExpense = {
                id: selectedExpense?.id || Date.now().toString(),
                ...formData,
                amount: parseFloat(formData.amount)
            };

            if (selectedExpense) {
                setExpenses(prev => prev.map(exp => exp.id === selectedExpense.id ? newExpense : exp));
            } else {
                setExpenses(prev => [...prev, newExpense]);
            }

            setOpenDialog(false);
        } catch (err) {
            setError('Erreur lors de la sauvegarde');
        }
    };

    const handleExport = () => {
        // TODO: Implémenter l'export
        console.log('Export des dépenses');
    };

    const getCategoryLabel = (categoryValue) => {
        const category = categories.find(cat => cat.value === categoryValue);
        return category ? category.label : categoryValue;
    };

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
                Gestion des Dépenses
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
                        <Grid item xs={12} md={3}>
                            <TextField
                                select
                                fullWidth
                                label="Catégorie"
                                value={filters.category}
                                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                            >
                                <MenuItem value="all">Toutes</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category.value} value={category.value}>
                                        {category.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={3}>
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

            {/* Liste des dépenses */}
            <Card>
                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Catégorie</TableCell>
                                    <TableCell align="right">Montant</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {expenses.map((expense) => (
                                    <TableRow key={expense.id}>
                                        <TableCell>
                                            {new Date(expense.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{expense.description}</TableCell>
                                        <TableCell>
                                            {getCategoryLabel(expense.category)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {expense.amount.toLocaleString()} GNF
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(expense)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(expense.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
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

            {/* Modal d'ajout/modification */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        {selectedExpense ? 'Modifier la dépense' : 'Nouvelle dépense'}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Date"
                                        value={formData.date}
                                        onChange={(date) => setFormData(prev => ({ ...prev, date }))}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Montant"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Catégorie"
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    required
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.value} value={category.value}>
                                            {category.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    multiline
                                    rows={3}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" variant="contained">
                            {selectedExpense ? 'Modifier' : 'Ajouter'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Expenses; 