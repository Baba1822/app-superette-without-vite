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
    CircularProgress
} from '@mui/material';

const PaymentProcessorDialog = ({ open, onClose, onProcessPayment, paymentData }) => {
    const [formData, setFormData] = useState({
        amount: paymentData?.amount || '',
        paymentMethod: paymentData?.paymentMethod || 'card',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        description: paymentData?.description || ''
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await onProcessPayment(formData);
            onClose();
        } catch (err) {
            setError(err.message || 'Une erreur est survenue lors du traitement du paiement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Traitement du Paiement</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Montant"
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: <Typography>€</Typography>
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Méthode de Paiement</InputLabel>
                                <Select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value="card">Carte Bancaire</MenuItem>
                                    <MenuItem value="cash">Espèces</MenuItem>
                                    <MenuItem value="transfer">Virement</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {formData.paymentMethod === 'card' && (
                            <>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Numéro de Carte"
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Date d'Expiration"
                                        name="expiryDate"
                                        placeholder="MM/AA"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="CVV"
                                        name="cvv"
                                        type="password"
                                        value={formData.cvv}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                            </>
                        )}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={2}
                                value={formData.description}
                                onChange={handleChange}
                            />
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
                        {loading ? 'Traitement...' : 'Traiter le Paiement'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PaymentProcessorDialog; 