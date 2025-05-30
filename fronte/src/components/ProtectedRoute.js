import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    return <Navigate to="/connexion" replace />;
  }

  if (role && user?.role !== role) {
    // Rediriger vers la page d'accueil si l'utilisateur n'a pas le rôle requis
    return <Navigate to="/" replace />;
  }

  // Si l'utilisateur est authentifié et a le bon rôle (si requis), afficher le contenu protégé
  return children;
};

export default ProtectedRoute;
