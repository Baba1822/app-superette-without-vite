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
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  LocalOffer as PromotionsIcon,
  Settings as SettingsIcon,
  Assessment as StatsIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../../services/orderService';

const AdminNavigation = () => {
  // Récupération du nombre de commandes en attente
  const { data: commandes = [] } = useQuery(['commandes'], orderService.getAllOrders, {
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
      icone: <InventoryIcon />,
      chemin: '/administration/produits'
    },
    {
      texte: 'Commandes',
      icone: <OrdersIcon />,
      chemin: '/administration/commandes',
      badge: commandesEnAttente
    },
    {
      texte: 'Clients',
      icone: <PeopleIcon />,
      chemin: '/administration/clients'
    },
    {
      texte: 'Promotions',
      icone: <PromotionsIcon />,
      chemin: '/administration/promotions'
    },
    {
      texte: 'Statistiques',
      icone: <StatsIcon />,
      chemin: '/administration/rapports'
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