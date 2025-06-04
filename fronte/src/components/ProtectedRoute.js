import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ 
  children, 
  roles = [], 
  redirectUnauthenticated = "/connexion", 
  redirectUnauthorized = "/" 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Afficher un simple texte pendant le chargement
  if (loading) {
    return <div>Loading...</div>;
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
    return <Navigate to={redirectUnauthorized} replace />;
  }

  // Rendu des enfants si toutes les vérifications passent
  return children;
};

export default ProtectedRoute;
