import {
    Download as DownloadIcon,
    Email as EmailIcon,
    Print as PrintIcon,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';

const InvoiceGenerator = ({ sale, open, onClose }) => {
    const [loading, setLoading] = useState(false);

    // Calculer les totaux
    const calculateTotals = () => {
        const subtotal = sale.products.reduce((sum, product) => 
            sum + (product.price * product.quantity), 0
        );
        const tva = subtotal * 0.18; // TVA à 18%
        const total = subtotal + tva;

        return { subtotal, tva, total };
    };

    const { subtotal, tva, total } = calculateTotals();

    // Générer le numéro de facture
    const invoiceNumber = `FAC-${new Date().getFullYear()}-${String(sale?.id).padStart(4, '0')}`;

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = async () => {
        try {
            setLoading(true);
            const response = await SalesService.generateInvoice(sale.id);
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `facture-${invoiceNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erreur lors du téléchargement de la facture:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = async () => {
        try {
            setLoading(true);
            await SalesService.sendInvoiceByEmail(sale.id, sale.clientEmail);
            // Afficher une notification de succès
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la facture par email:', error);
            // Afficher une notification d'erreur
        } finally {
            setLoading(false);
        }
    };

    const renderInvoiceHeader = () => (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                    FACTURE
                </Typography>
                <Typography variant="body2">Numéro: {invoiceNumber}</Typography>
                <Typography variant="body2">
                    Date: {new Date(sale?.date).toLocaleDateString()}
                </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="h6" gutterBottom>
                    Votre Entreprise
                </Typography>
                <Typography variant="body2">123 Rue du Commerce</Typography>
                <Typography variant="body2">75000 Paris</Typography>
                <Typography variant="body2">Tél: +33 1 23 45 67 89</Typography>
                <Typography variant="body2">Email: contact@entreprise.com</Typography>
            </Grid>
        </Grid>
    );

    const renderClientInfo = () => (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                    Facturé à:
                </Typography>
                <Typography variant="body2">{sale?.clientName}</Typography>
                <Typography variant="body2">{sale?.clientAddress}</Typography>
                <Typography variant="body2">{sale?.clientEmail}</Typography>
                <Typography variant="body2">{sale?.clientPhone}</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="body2">
                    Mode de paiement: {sale?.paymentMethod}
                </Typography>
                <Typography variant="body2">
                    Statut: {sale?.status}
                </Typography>
            </Grid>
        </Grid>
    );

    const renderProductsTable = () => (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Quantité</TableCell>
                    <TableCell align="right">Prix unitaire</TableCell>
                    <TableCell align="right">Total</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {sale?.products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell align="right">{product.quantity}</TableCell>
                        <TableCell align="right">
                            {product.price.toLocaleString()} FCFA
                        </TableCell>
                        <TableCell align="right">
                            {(product.price * product.quantity).toLocaleString()} FCFA
                        </TableCell>
                    </TableRow>
                ))}
                <TableRow>
                    <TableCell colSpan={2} />
                    <TableCell align="right">Sous-total</TableCell>
                    <TableCell align="right">
                        {subtotal.toLocaleString()} FCFA
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={2} />
                    <TableCell align="right">TVA (18%)</TableCell>
                    <TableCell align="right">
                        {tva.toLocaleString()} FCFA
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={2} />
                    <TableCell align="right">
                        <Typography variant="subtitle1">Total</Typography>
                    </TableCell>
                    <TableCell align="right">
                        <Typography variant="subtitle1">
                            {total.toLocaleString()} FCFA
                        </Typography>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Facture {invoiceNumber}
                <Box sx={{ float: 'right' }}>
                    <Button
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                        disabled={loading}
                    >
                        Imprimer
                    </Button>
                    <Button
                        startIcon={<DownloadIcon />}
                        onClick={handleDownload}
                        disabled={loading}
                    >
                        Télécharger
                    </Button>
                    <Button
                        startIcon={<EmailIcon />}
                        onClick={handleSendEmail}
                        disabled={loading}
                    >
                        Envoyer
                    </Button>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Paper sx={{ p: 3 }} className="invoice-content">
                    {renderInvoiceHeader()}
                    <Divider sx={{ my: 3 }} />
                    {renderClientInfo()}
                    {renderProductsTable()}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="body2" gutterBottom>
                            Conditions de paiement: Paiement à réception de la facture
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Merci de votre confiance !
                        </Typography>
                    </Box>
                </Paper>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fermer</Button>
            </DialogActions>
        </Dialog>
    );
};

export default InvoiceGenerator; 