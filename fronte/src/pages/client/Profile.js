import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Alert,
    Snackbar
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });
    const [success, setSuccess] = useState(false);
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
        try {
            // TODO: Implémenter la mise à jour du profil
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess(true);
        } catch (err) {
            setError('Erreur lors de la mise à jour du profil');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Snackbar
                open={success}
                autoHideDuration={6000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="success">Profil mis à jour avec succès</Alert>
            </Snackbar>

            <Typography variant="h4" gutterBottom>
                Mon Profil
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Nom complet"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Téléphone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Adresse"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            multiline
                                            rows={3}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {error && (
                                            <Alert severity="error" sx={{ mb: 2 }}>
                                                {error}
                                            </Alert>
                                        )}
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                        >
                                            Mettre à jour
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Informations du compte
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Membre depuis: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Statut: {user?.status || 'Actif'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile; 