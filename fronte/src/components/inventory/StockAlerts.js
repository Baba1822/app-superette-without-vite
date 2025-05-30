import {
    Notifications as NotificationsIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import React from 'react';

const StockAlerts = ({ products }) => {
    const lowStockProducts = products.filter(product => 
        product.quantity <= product.minQuantity
    );

    const getStockStatus = (product) => {
        const ratio = (product.quantity / product.minQuantity) * 100;
        if (ratio <= 50) return 'critical';
        if (ratio <= 75) return 'warning';
        return 'normal';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'critical':
                return 'error';
            case 'warning':
                return 'warning';
            default:
                return 'success';
        }
    };

    const handleNotifySupplier = (product) => {
        // Implémenter la notification au fournisseur
        console.log(`Notifier le fournisseur pour ${product.name}`);
        // Ici, vous pourriez intégrer l'envoi d'emails ou de SMS via Twilio
    };

    if (lowStockProducts.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6" color="success.main">
                        Tous les stocks sont à des niveaux normaux
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WarningIcon color="error" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                        Alertes de Stock ({lowStockProducts.length})
                    </Typography>
                </Box>

                <List>
                    {lowStockProducts.map((product) => (
                        <ListItem
                            key={product.id}
                            sx={{
                                bgcolor: 'background.paper',
                                mb: 1,
                                borderRadius: 1,
                                border: 1,
                                borderColor: 'divider',
                            }}
                        >
                            <ListItemIcon>
                                <WarningIcon color={getStatusColor(getStockStatus(product))} />
                            </ListItemIcon>
                            <ListItemText
                                primary={product.name}
                                secondary={
                                    <>
                                        Stock actuel: {product.quantity} {product.unit}
                                        <br />
                                        Stock minimum: {product.minQuantity} {product.unit}
                                    </>
                                }
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                    label={`${Math.round((product.quantity / product.minQuantity) * 100)}%`}
                                    color={getStatusColor(getStockStatus(product))}
                                    size="small"
                                />
                                <Button
                                    startIcon={<NotificationsIcon />}
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleNotifySupplier(product)}
                                >
                                    Notifier
                                </Button>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default StockAlerts; 