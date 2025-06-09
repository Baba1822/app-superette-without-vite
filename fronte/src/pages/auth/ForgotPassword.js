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
  IconButton,
  Stack,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../config/api.config';
import { Storefront as StorefrontIcon } from '@mui/icons-material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Veuillez entrer une adresse email');
      return;
    }
    if (!email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Un email de réinitialisation a été envoyé à votre adresse');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: '100vh',
              justifyContent: 'center',
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                bgcolor: 'white',
                borderRadius: 2,
              }}
            >
              <IconButton
                component={RouterLink}
                to="/login"
                sx={{ position: 'absolute', top: 16, left: 16 }}
              >
                <ArrowBackIcon />
              </IconButton>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <StorefrontIcon sx={{ mr: 1, fontSize: '2.5rem', color: '#1976d2' }} />
                <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }} gutterBottom>
                  App Superette
                </Typography>
              </Box>

              <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
                Email envoyé !
              </Typography>
              
              <Typography variant="body1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
                Un email contenant les instructions de réinitialisation de mot de passe a été envoyé à {email}.
                <br />
                Vérifiez votre boîte de réception et suivez les instructions pour créer un nouveau mot de passe.
              </Typography>

              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 3, px: 4 }}
              >
                Retour à la connexion
              </Button>
            </Paper>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            justifyContent: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              bgcolor: 'white',
              borderRadius: 2,
            }}
          >
            <IconButton
              component={RouterLink}
              to="/login"
              sx={{ position: 'absolute', top: 16, left: 16 }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <StorefrontIcon sx={{ mr: 1, fontSize: '2.5rem', color: '#1976d2' }} />
              <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }} gutterBottom>
                App Superette
              </Typography>
            </Box>

            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
              Mot de passe oublié
            </Typography>
            
            <Typography variant="body1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
              Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
                helperText={error}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Envoyer'}
              </Button>

              <Stack direction="row" justifyContent="center" spacing={2}>
                <Link component={RouterLink} to="/login" variant="body2">
                  Retour à la connexion
                </Link>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword; 