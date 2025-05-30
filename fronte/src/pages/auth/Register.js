import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, Button, Container, Box, Typography, 
  CircularProgress, Alert, FormControl, InputLabel, 
  Select, MenuItem, Paper 
} from '@mui/material';
import { Storefront as StorefrontIcon } from '@mui/icons-material';

function Register() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    role: 'client'
  });
  
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate(formData.role === 'admin' ? '/admin/dashboard' : '/client/shop');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <StorefrontIcon sx={{ mr: 1, fontSize: '2rem' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>App Superette - Inscription</Typography>
            </Box>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Rôle</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Rôle"
                  disabled={loading}
                >
                  <MenuItem value="client">Client</MenuItem>
                  <MenuItem value="admin">Administrateur</MenuItem>
                </Select>
              </FormControl>

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
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default Register;