import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  TextField, Button, Container, Box, Typography, 
  CircularProgress, Alert 
} from '@mui/material';

function ClientRegister() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: ''
  });
  
  const { clientRegister, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await clientRegister(formData);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Inscription Client</Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Prénom"
            name="prenom"
            fullWidth
            margin="normal"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
          <TextField
            label="Nom"
            name="nom"
            fullWidth
            margin="normal"
            value={formData.nom}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Téléphone"
            name="telephone"
            fullWidth
            margin="normal"
            value={formData.telephone}
            onChange={handleChange}
            required
          />
          <TextField
            label="Mot de passe"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <TextField
            label="Confirmer mot de passe"
            name="confirmPassword"
            type="password"
            fullWidth
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'S\'inscrire'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ClientRegister;