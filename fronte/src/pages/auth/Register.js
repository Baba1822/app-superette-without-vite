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
  Divider,
  styled,
  Grid,
  Link
} from '@mui/material';
import { Storefront as StorefrontIcon, Person, Email, Phone, Lock } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#9e9e9e',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2196f3',
    },
  },
});

const StyledButton = styled(Button)({
  textTransform: 'none',
  borderRadius: '25px',
  padding: '12px 32px',
  fontSize: '1rem',
  fontWeight: 600,
  boxShadow: '0px 2px 10px rgba(33, 150, 243, 0.2)',
  '&:hover': {
    boxShadow: '0px 4px 15px rgba(33, 150, 243, 0.3)',
  },
});

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
        const redirectUrl = result.redirectUrl || '/Shop'; // fallback vers /Shop pour les clients
        navigate(redirectUrl, { replace: true });
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
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <StorefrontIcon sx={{ fontSize: '3.5rem', color: 'primary.main', mb: 1 }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
              Créer votre compte
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
              Rejoignez App Superette et commencez à faire vos courses en ligne !
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Prénom *"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="medium"
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1 }} />
                  }}
                  error={!!errors.prenom}
                  helperText={errors.prenom}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  variant="outlined"
                  size="medium"
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1 }} />
                  }}
                  error={!!errors.nom}
                  helperText={errors.nom}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="medium"
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1 }} />
                  }}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Téléphone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  variant="outlined"
                  size="medium"
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1 }} />
                  }}
                  error={!!errors.telephone}
                  helperText={errors.telephone}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  name="motdepasse"
                  label="Mot de passe *"
                  type="password"
                  value={formData.motdepasse}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="medium"
                  InputProps={{
                    startAdornment: <Lock sx={{ mr: 1 }} />
                  }}
                  error={!!errors.motdepasse}
                  helperText={errors.motdepasse}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', mb: 2 }}>
                <Link href="/forgot-password" variant="body2" color="primary">
                  Mot de passe oublié ?
                </Link>
              </Typography>
              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    <Typography variant="button">Créer mon compte</Typography>
                  </Box>
                ) : (
                  'Créer mon compte'
                )}
              </StyledButton>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Déjà un compte ?{' '}
                  <Link href="/login" variant="body2" color="primary">
                    Se connecter
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;