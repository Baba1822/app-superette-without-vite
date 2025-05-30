import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Typography,
    CircularProgress,
    Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import frLocale from 'date-fns/locale/fr';

const ReportDialog = ({
    open,
    onClose,
    onGenerateReport,
    reportTypes
}) => {
    const [formData, setFormData] = useState({
        type: '',
        startDate: null,
        endDate: null,
        format: 'pdf',
        filters: {}
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (field) => (date) => {
        setFormData(prev => ({
            ...prev,
            [field]: date
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await onGenerateReport(formData);
            onClose();
        } catch (err) {
            setError(err.message || 'Une erreur est survenue lors de la génération du rapport');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Générer un Rapport</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Type de Rapport</InputLabel>
                                <Select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                >
                                    {reportTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
                                <DatePicker
                                    label="Date de début"
                                    value={formData.startDate}
                                    onChange={handleDateChange('startDate')}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
                                <DatePicker
                                    label="Date de fin"
                                    value={formData.endDate}
                                    onChange={handleDateChange('endDate')}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Format du Rapport</InputLabel>
                                <Select
                                    name="format"
                                    value={formData.format}
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value="pdf">PDF</MenuItem>
                                    <MenuItem value="excel">Excel</MenuItem>
                                    <MenuItem value="csv">CSV</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Annuler</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} />}
                    >
                        {loading ? 'Génération...' : 'Générer le Rapport'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ReportDialog; 