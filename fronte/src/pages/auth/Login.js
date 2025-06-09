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
  styled,
  Grid,
  InputAdornment
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Storefront as StorefrontIcon, Email, Lock } from '@mui/icons-material';

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

const StyledPaper = styled(Paper)({
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
});

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    motdepasse: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    motdepasse: '',
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
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
      const loginCredentials = {
        email: formData.email.trim(),
        motdepasse: formData.motdepasse
      };

      console.log('Tentative de connexion pour:', loginCredentials.email);

      const result = await login(loginCredentials);
       
      console.log('Résultat de la connexion:', {
        success: result?.success,
        redirectPath: result?.redirectPath,
        userType: result?.user?.type
      });
       
      if (result?.success) {
        // Déterminer le chemin de redirection en fonction du rôle
        const userType = result.user.type;

        switch (userType) {
          case 'admin':
            // Pour l'admin, nous devons d'abord accéder au layout
            navigate('/administration', { replace: true });
            break;
          case 'client':
            // Pour le client, Shop est déjà défini comme route
            navigate('/Shop', { replace: true });
            break;
          case 'cashier':
            // Pour le caissier, nous devons d'abord accéder au layout
            navigate('/caisse', { replace: true });
            break;
          case 'stockist':
            // Pour le gestionnaire d'inventaire
            navigate('/inventaire', { replace: true });
            break;
          case 'manager':
            // Pour le manager, nous devons d'abord accéder au layout
            navigate('/finances', { replace: true });
            break;
        }

        console.log('Redirection vers:', userType, 'vers son dashboard');
        
        // Message de succès basé sur le type
        
        // Message de succès basé sur le type d'utilisateur
        let roleMessage = 'Connexion réussie !';
        switch (userType) {
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
            roleMessage = 'Bienvenue dans l\'interface finance !';
            break;
        }
        toast.success(roleMessage);
      } else {
        setError(result?.message || 'Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError(error.message || 'Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <StyledPaper elevation={0} sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <StorefrontIcon sx={{ fontSize: '3.5rem', color: 'primary.main', mb: 1 }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
              Connexion
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
                  label="Adresse email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                  disabled={loading}
                  error={!!errors.email}
                  helperText={errors.email}
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
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                  disabled={loading}
                  error={!!errors.motdepasse}
                  helperText={errors.motdepasse}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', mb: 2 }}>
                  <Link component={RouterLink} to="/mot-de-passe-oublie" variant="body2" color="primary">
                    Mot de passe oublié ?
                  </Link>
                </Typography>
              </Grid>

              <Grid item xs={12}>
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
                      <Typography variant="button">Connexion...</Typography>
                    </Box>
                  ) : (
                    'Se connecter'
                  )}
                </StyledButton>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Pas encore de compte ?{' '}
                    <Link component={RouterLink} to="/register" variant="body2" color="primary">
                      Créer un compte
                    </Link>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default Login;