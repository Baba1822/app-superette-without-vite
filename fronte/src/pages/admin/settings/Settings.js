import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

function Settings() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

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
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Le prénom est requis';
            isValid = false;
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Le nom est requis';
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Veuillez entrer une adresse email valide';
            isValid = false;
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Le numéro de téléphone est requis';
            isValid = false;
        } else if (!/^224[678]\d{8}$/.test(formData.phone)) {
            newErrors.phone = 'Le numéro doit commencer par 224 suivi de 8 chiffres (commençant par 6, 7 ou 8)';
            isValid = false;
        }

        if (formData.newPassword) {
            if (formData.newPassword.length < 8) {
                newErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
                isValid = false;
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
                newErrors.newPassword = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
                isValid = false;
            }

            if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/settings/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone
                })
            });

            if (response.ok) {
                setSnackbar({
                    open: true,
                    message: 'Profil mis à jour avec succès',
                    severity: 'success'
                });
            } else {
                setSnackbar({
                    open: true,
                    message: 'Erreur lors de la mise à jour du profil',
                    severity: 'error'
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Erreur de connexion au serveur',
                severity: 'error'
            });
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/settings/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            if (response.ok) {
                setSnackbar({
                    open: true,
                    message: 'Mot de passe mis à jour avec succès',
                    severity: 'success'
                });
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            } else {
                setSnackbar({
                    open: true,
                    message: 'Erreur lors de la mise à jour du mot de passe',
                    severity: 'error'
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Erreur de connexion au serveur',
                severity: 'error'
            });
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Paramètres
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Informations du profil
                                </Typography>
                                <form onSubmit={handleSubmit}>
                                    <TextField
                                        fullWidth
                                        label="Prénom"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        error={!!errors.firstName}
                                        helperText={errors.firstName}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Nom"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        error={!!errors.lastName}
                                        helperText={errors.lastName}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Téléphone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        error={!!errors.phone}
                                        helperText={errors.phone}
                                        margin="normal"
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ mt: 2 }}
                                    >
                                        Mettre à jour le profil
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Changer le mot de passe
                                </Typography>
                                <form onSubmit={handlePasswordChange}>
                                    <TextField
                                        fullWidth
                                        label="Mot de passe actuel"
                                        name="currentPassword"
                                        type="password"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        error={!!errors.currentPassword}
                                        helperText={errors.currentPassword}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Nouveau mot de passe"
                                        name="newPassword"
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        error={!!errors.newPassword}
                                        helperText={errors.newPassword}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Confirmer le nouveau mot de passe"
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword}
                                        margin="normal"
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ mt: 2 }}
                                    >
                                        Changer le mot de passe
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default Settings; 