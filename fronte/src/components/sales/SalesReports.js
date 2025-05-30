import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    PictureAsPdf as PdfIcon,
    TableChart as ExcelIcon,
    Print as PrintIcon,
    Assessment as ChartIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import SalesService from '../../services/SalesService';

const SalesReports = () => {
    const [dateRange, setDateRange] = useState({
        start: new Date(),
        end: new Date(),
    });
    const [reportType, setReportType] = useState('daily');
    const [reportFormat, setReportFormat] = useState('pdf');
    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    const reportTypes = [
        { value: 'daily', label: 'Rapport Journalier' },
        { value: 'weekly', label: 'Rapport Hebdomadaire' },
        { value: 'monthly', label: 'Rapport Mensuel' },
        { value: 'annual', label: 'Rapport Annuel' },
        { value: 'custom', label: 'Période Personnalisée' },
    ];

    const handleGenerateReport = async () => {
        try {
            setLoading(true);
            const report = await SalesService.generateSalesReport(
                dateRange.start,
                dateRange.end,
                reportFormat
            );

            if (reportFormat === 'preview') {
                setPreviewData(report);
                setPreviewOpen(true);
            } else {
                // Télécharger le fichier
                const url = window.URL.createObjectURL(new Blob([report]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `rapport-ventes-${reportType}.${reportFormat}`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        } catch (error) {
            console.error('Erreur lors de la génération du rapport:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrintReport = async () => {
        try {
            setLoading(true);
            const report = await SalesService.generateSalesReport(
                dateRange.start,
                dateRange.end,
                'html'
            );

            const printWindow = window.open('', '_blank');
            printWindow.document.write(report);
            printWindow.document.close();
            printWindow.print();
        } catch (error) {
            console.error('Erreur lors de l\'impression du rapport:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderReportActions = () => (
        <Grid container spacing={2}>
            <Grid item>
                <Button
                    variant="contained"
                    startIcon={<PdfIcon />}
                    onClick={() => {
                        setReportFormat('pdf');
                        handleGenerateReport();
                    }}
                    disabled={loading}
                >
                    Exporter en PDF
                </Button>
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    startIcon={<ExcelIcon />}
                    onClick={() => {
                        setReportFormat('xlsx');
                        handleGenerateReport();
                    }}
                    disabled={loading}
                >
                    Exporter en Excel
                </Button>
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={handlePrintReport}
                    disabled={loading}
                >
                    Imprimer
                </Button>
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    startIcon={<ChartIcon />}
                    onClick={() => {
                        setReportFormat('preview');
                        handleGenerateReport();
                    }}
                    disabled={loading}
                >
                    Aperçu
                </Button>
            </Grid>
        </Grid>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Rapports de Ventes
            </Typography>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Type de Rapport</InputLabel>
                                <Select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    label="Type de Rapport"
                                >
                                    {reportTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {(reportType === 'custom') && (
                            <Grid item xs={12} md={8}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <DatePicker
                                                label="Date de début"
                                                value={dateRange.start}
                                                onChange={(date) =>
                                                    setDateRange({ ...dateRange, start: date })
                                                }
                                                renderInput={(params) => <TextField {...params} fullWidth />}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <DatePicker
                                                label="Date de fin"
                                                value={dateRange.end}
                                                onChange={(date) =>
                                                    setDateRange({ ...dateRange, end: date })
                                                }
                                                renderInput={(params) => <TextField {...params} fullWidth />}
                                            />
                                        </Grid>
                                    </Grid>
                                </LocalizationProvider>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>

            {renderReportActions()}

            <Dialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>Aperçu du Rapport</DialogTitle>
                <DialogContent>
                    {previewData && (
                        <div dangerouslySetInnerHTML={{ __html: previewData }} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPreviewOpen(false)}>Fermer</Button>
                    <Button onClick={handlePrintReport} startIcon={<PrintIcon />}>
                        Imprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SalesReports; 