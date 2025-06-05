import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Storefront as StorefrontIcon } from '@mui/icons-material';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    motdepasse: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError('');
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
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
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const result = await login({
        email: formData.email.trim(),
        motdepasse: formData.motdepasse
      });
      
      if (result?.success) {
        // Utilisation de la redirection basée sur le rôle
        const from = location.state?.from?.pathname;
        const redirectPath = result.redirectPath;
        
        // Si l'utilisateur avait une destination spécifique avant la connexion, on la respecte
        // Sinon, on utilise la redirection basée sur le rôle
        const finalPath = from && from !== '/login' && from !== '/register' && from !== '/connexion' 
          ? from 
          : redirectPath;
        
        // Message personnalisé selon le rôle
        let roleMessage = 'Connexion réussie !';
        switch (result.user.role) {
          case 'admin':
            roleMessage = 'Bienvenue dans le tableau de bord administrateur !';
            break;
          case 'client':
            roleMessage = 'Bienvenue dans notre boutique !';
            break;
          case 'cashier':
            roleMessage = 'Bienvenue dans l\'interface caisse !';
            break;
          case 'stockist':
            roleMessage = 'Bienvenue dans l\'interface inventaire !';
            break;
          case 'manager':
            roleMessage = 'Bienvenue dans l\'interface de gestion !';
            break;
          default:
            roleMessage = 'Bienvenue !';
        }
        
        toast.success(roleMessage);
        navigate(finalPath, { replace: true });
      } else {
        setError(result?.message || 'Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container component="main" maxWidth="xs">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StorefrontIcon sx={{ mr: 1, fontSize: '2rem' }} />
              <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
                Connexion
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Adresse email"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="motdepasse"
                label="Mot de passe"
                type="password"
                id="motdepasse"
                autoComplete="current-password"
                value={formData.motdepasse}
                onChange={handleChange}
                disabled={loading}
                error={!!errors.motdepasse}
                helperText={errors.motdepasse}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Link component={RouterLink} to="/mot-de-passe-oublie" variant="body2">
                  Mot de passe oublié ?
                </Link>
                <Link component={RouterLink} to="/register" variant="body2">
                  Créer un compte
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;