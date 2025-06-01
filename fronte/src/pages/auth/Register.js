import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Container, 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Paper,
  Divider
} from '@mui/material';
import { Storefront as StorefrontIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

function Register() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    motdepasse: ''
  });
  
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await register({
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        motdepasse: formData.motdepasse
      });
      
      if (success) {
        navigate('/shop'); // Redirection vers la page shop après inscription réussie
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ 
          p: 4, 
          width: '100%',
          borderRadius: 2,
          boxShadow: '0px 2px 10px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <StorefrontIcon sx={{ 
              mr: 1, 
              fontSize: '2.5rem',
              color: 'primary.main',
              mb: 1
            }} />
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold',
              mb: 3,
              color: 'text.primary'
            }}>
              SuperMarché en Ligne - Inscription
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Champ Prénom - Ligne séparée */}
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
            />

            {/* Champ Nom - Ligne séparée */}
            <TextField
              fullWidth
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />

            {/* Section Email */}
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
            />

            <Divider sx={{ my: 3 }} />

            {/* Section Téléphone */}
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
              Téléphone
            </Typography>
            <TextField
              fullWidth
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{ mb: 3 }}
            />

            {/* Section Mot de passe */}
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
              Mot de passe *
            </Typography>
            <TextField
              fullWidth
              label=""
              name="motdepasse"
              type="password"  // Corrigé de 'motdepasse' à 'password'
              value={formData.motdepasse}
              onChange={handleChange}
              required
              variant="outlined"
              size="small"
              sx={{ mb: 3 }}
            />

            {/* Bouton d'inscription */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              {loading ? <CircularProgress size={24} /> : "S'inscrire"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;