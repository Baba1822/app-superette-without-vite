import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';
import { getRedirectPath } from '../context/AuthContext';

// Composant principal ProtectedRoute
const ProtectedRoute = ({
  children,
  roles = [],
  redirectUnauthenticated = "/login", // Changé de "/connexion" à "/login"
  redirectUnauthorized = null
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Gestion du chargement
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

  // Gestion des rôles - redirection immédiate si non autorisé
  if (roles.length > 0 && user?.type && !roles.includes(user.type)) {
    const finalRedirect = redirectUnauthorized || getRedirectPath(user.type);
    return (
      <Navigate 
        to={finalRedirect}
        replace
      />
    );
  }

  // CORRECTION: Utiliser Outlet au lieu de children pour les routes imbriquées
  return children || <Outlet />;
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

// Composant pour les routes caissier
export const CashierRoute = ({ children }) => (
  <ProtectedRoute roles={['cashier']}>
    {children}
  </ProtectedRoute>
);

// Composant pour les routes stockist
export const StockistRoute = ({ children }) => (
  <ProtectedRoute roles={['stockist']}>
    {children}
  </ProtectedRoute>
);

// Composant pour les routes manager
export const ManagerRoute = ({ children }) => (
  <ProtectedRoute roles={['manager']}>
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