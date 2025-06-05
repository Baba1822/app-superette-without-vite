import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const ProtectedRoute = ({
  children,
  roles = [],
  redirectUnauthenticated = "/connexion",
  redirectUnauthorized = null // null pour redirection automatique basée sur le rôle
}) => {
  const { isAuthenticated, user, loading, getRedirectPath } = useAuth();
  const location = useLocation();

  // Composant de chargement amélioré
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="textSecondary">
          Vérification de l'authentification...
        </Typography>
      </Box>
    );
  }

  // Redirection si non authentifié
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectUnauthenticated}
        state={{ from: location }}
        replace
      />
    );
  }

  // Vérification des rôles si spécifiés
  if (roles.length > 0 && (!user?.role || !roles.includes(user.role))) {
    // Si redirectUnauthorized n'est pas spécifié, utiliser la redirection basée sur le rôle
    const finalRedirect = redirectUnauthorized || getRedirectPath(user.role);
    return <Navigate to={finalRedirect} replace />;
  }

  // Rendu des enfants si toutes les vérifications passent
  return children;
};

// Composant spécialisé pour les routes admin
export const AdminRoute = ({ children }) => (
  <ProtectedRoute roles={['admin']}>
    {children}
  </ProtectedRoute>
);

// Composant spécialisé pour les routes client
export const ClientRoute = ({ children }) => (
  <ProtectedRoute roles={['client']}>
    {children}
  </ProtectedRoute>
);

// Composant pour les routes accessibles aux utilisateurs connectés (tous rôles)
export const AuthenticatedRoute = ({ children }) => (
  <ProtectedRoute>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;