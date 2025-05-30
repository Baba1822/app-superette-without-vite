import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Typography,
    Switch,
    FormControlLabel,
    CircularProgress
} from '@mui/material';

const ReminderSettingsDialog = ({
    open,
    onClose,
    onSave,
    initialSettings
}) => {
    const [settings, setSettings] = useState({
        enabled: initialSettings?.enabled ?? true,
        firstReminder: {
            daysBefore: initialSettings?.firstReminder?.daysBefore ?? 7,
            method: initialSettings?.firstReminder?.method ?? 'email',
            message: initialSettings?.firstReminder?.message ?? ''
        },
        secondReminder: {
            daysBefore: initialSettings?.secondReminder?.daysBefore ?? 3,
            method: initialSettings?.secondReminder?.method ?? 'sms',
            message: initialSettings?.secondReminder?.message ?? ''
        },
        finalReminder: {
            daysBefore: initialSettings?.finalReminder?.daysBefore ?? 1,
            method: initialSettings?.finalReminder?.method ?? 'call',
            message: initialSettings?.finalReminder?.message ?? ''
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (reminderType, field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setSettings(prev => ({
            ...prev,
            [reminderType]: {
                ...prev[reminderType],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await onSave(settings);
            onClose();
        } catch (err) {
            setError(err.message || 'Une erreur est survenue lors de la sauvegarde des paramètres');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Paramètres des Rappels</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.enabled}
                                        onChange={(e) => setSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                                    />
                                }
                                label="Activer les rappels automatiques"
                            />
                        </Grid>

                        {/* Premier rappel */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Premier Rappel
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Jours avant l'échéance"
                                value={settings.firstReminder.daysBefore}
                                onChange={handleChange('firstReminder', 'daysBefore')}
                                InputProps={{ inputProps: { min: 1 } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Méthode</InputLabel>
                                <Select
                                    value={settings.firstReminder.method}
                                    onChange={handleChange('firstReminder', 'method')}
                                    label="Méthode"
                                >
                                    <MenuItem value="email">Email</MenuItem>
                                    <MenuItem value="sms">SMS</MenuItem>
                                    <MenuItem value="call">Appel</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Message"
                                value={settings.firstReminder.message}
                                onChange={handleChange('firstReminder', 'message')}
                                placeholder="Entrez le message du premier rappel..."
                            />
                        </Grid>

                        {/* Deuxième rappel */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Deuxième Rappel
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Jours avant l'échéance"
                                value={settings.secondReminder.daysBefore}
                                onChange={handleChange('secondReminder', 'daysBefore')}
                                InputProps={{ inputProps: { min: 1 } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Méthode</InputLabel>
                                <Select
                                    value={settings.secondReminder.method}
                                    onChange={handleChange('secondReminder', 'method')}
                                    label="Méthode"
                                >
                                    <MenuItem value="email">Email</MenuItem>
                                    <MenuItem value="sms">SMS</MenuItem>
                                    <MenuItem value="call">Appel</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Message"
                                value={settings.secondReminder.message}
                                onChange={handleChange('secondReminder', 'message')}
                                placeholder="Entrez le message du deuxième rappel..."
                            />
                        </Grid>

                        {/* Rappel final */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Rappel Final
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Jours avant l'échéance"
                                value={settings.finalReminder.daysBefore}
                                onChange={handleChange('finalReminder', 'daysBefore')}
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Méthode</InputLabel>
                                <Select
                                    value={settings.finalReminder.method}
                                    onChange={handleChange('finalReminder', 'method')}
                                    label="Méthode"
                                >
                                    <MenuItem value="email">Email</MenuItem>
                                    <MenuItem value="sms">SMS</MenuItem>
                                    <MenuItem value="call">Appel</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Message"
                                value={settings.finalReminder.message}
                                onChange={handleChange('finalReminder', 'message')}
                                placeholder="Entrez le message du rappel final..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Annuler</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} />}
                    >
                        {loading ? 'Sauvegarde...' : 'Enregistrer les Paramètres'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ReminderSettingsDialog; 