import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  ShoppingCart as CartIcon,
  Dashboard as DashboardIcon,
  LocalShipping as DeliveryIcon,
  Inventory as InventoryIcon,
  LocalMall as LocalMallIcon,
  CardMembership as LoyaltyIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  Receipt as OrderIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../../services/orderService';

const AdminNavigation = () => {
  // Récupération du nombre de commandes en attente - SYNTAXE CORRIGÉE POUR v5
  const { data: commandes = [] } = useQuery({
    queryKey: ['commandes'],
    queryFn: orderService.getAllOrders,
    retry: false,
    onError: (error) => {
      console.warn('Erreur lors de la récupération des commandes:', error);
    }
  });

  const commandesEnAttente = commandes.filter(commande => commande.status === 'en_attente').length;

  const elementsMenu = [
    {
      texte: 'Tableau de bord',
      icone: <DashboardIcon />,
      chemin: '/administration'
    },
    {
      texte: 'Produits',
      icone: <LocalMallIcon />,
      chemin: '/administration/produits'
    },
    {
      texte: 'Clientèle',
      icone: <PersonIcon />,
      chemin: '/administration/clients'
    },
    {
      texte: 'Ventes',
      icone: <CartIcon />,
      chemin: '/administration/ventes'
    },   
    {
      texte: 'Commandes',
      icone: <OrderIcon />,
      chemin: '/administration/commandes',
      badge: commandesEnAttente
    },
    {
      texte: 'Paiements',
      icone: <PaymentIcon />,
      chemin: '/administration/paiements'
    },
    {
      texte: 'Fournisseurs',
      icone: <StoreIcon />,
      chemin: '/administration/fournisseurs'
    },
    {
      texte: 'Employés',
      icone: <PeopleIcon />,
      chemin: '/administration/employes'
    },
    {
      texte: 'Rapports',
      icone: <AssessmentIcon />,
      chemin: '/administration/rapports'
    },
    {
      texte: 'Fidélité',
      icone: <LoyaltyIcon />,
      chemin: '/administration/fidelite'
    },
    {
      texte: 'Livraisons',
      icone: <DeliveryIcon />,
      chemin: '/administration/livraisons'
    },
    {
      texte: 'Paramètres',
      icone: <SettingsIcon />,
      chemin: '/administration/parametres'
    }
  ];

  return (
    <List>
      {elementsMenu.map((element, index) => (
        <React.Fragment key={element.texte}>
          <ListItem
            button
            component={Link}
            to={element.chemin}
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <ListItemIcon>
              {element.badge ? (
                <Badge badgeContent={element.badge} color="error">
                  {element.icone}
                </Badge>
              ) : (
                element.icone
              )}
            </ListItemIcon>
            <ListItemText primary={element.texte} />
          </ListItem>
          {index < elementsMenu.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default AdminNavigation;