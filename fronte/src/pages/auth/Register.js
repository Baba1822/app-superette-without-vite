import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { Storefront as StorefrontIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    motdepasse: ''
  });
  
  const [errors, setErrors] = useState({});
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.motdepasse) {
      newErrors.motdepasse = 'Le mot de passe est requis';
    } else if (formData.motdepasse.length < 6) {
      newErrors.motdepasse = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await register({
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        motdepasse: formData.motdepasse
      });
      
      if (result?.success) {
        // Utiliser le chemin de redirection basé sur le rôle au lieu de naviguer vers '/'
        const redirectPath = result.redirectPath || '/Shop'; // fallback vers /Shop pour les clients
        navigate(redirectPath);
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.message || "Erreur lors de l'inscription");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ p: 4, width: '100%', borderRadius: 2, boxShadow: '0px 2px 10px rgba(0,0,0,0.1)' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <StorefrontIcon sx={{ mr: 1, fontSize: '2.5rem', color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
              Inscription
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Prénom *"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
              error={!!errors.prenom}
              helperText={errors.prenom}
            />

            <TextField
              fullWidth
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
              error={!!errors.nom}
              helperText={errors.nom}
            />

            <TextField
              fullWidth
              label="Email *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
              error={!!errors.email}
              helperText={errors.email}
            />

            <Divider sx={{ my: 3 }} />

            <TextField
              fullWidth
              label="Téléphone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ mb: 3 }}
              error={!!errors.telephone}
              helperText={errors.telephone}
            />

            <TextField
              fullWidth
              name="motdepasse"
              label="Mot de passe *"
              type="password"
              value={formData.motdepasse}
              onChange={handleChange}
              required
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
              error={!!errors.motdepasse}
              helperText={errors.motdepasse}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'S\'inscrire'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;