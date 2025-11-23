'use client';

import { useState } from 'react';
import { useStore } from '../../../store/useStore';
import {
    Typography,
    Box,
    Paper,
    Card,
    CardMedia,
    CardActionArea,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useTranslation } from '../../../hooks/useTranslation';
import Breadcrumbs from '../../../components/Breadcrumbs';

// Available background images
const backgroundImages = [
    { name: 'Paper Mobile', filename: 'paper-mobile.jpg', thumbnail: '/paper-mobile.jpg' },
    { name: 'Background 2', filename: 'bg-2.jpg', thumbnail: '/bg-2.jpg' },
    { name: 'Background 3', filename: 'bg-3.jpg', thumbnail: '/bg-3.jpg' },
    { name: 'Glass', filename: 'bg-4.jpg', thumbnail: '/bg-4.jpg' },
];

export default function SelectBackgroundPage() {
    const { settings, updateSettings } = useStore();
    const { t } = useTranslation();
    const [selectedBackground, setSelectedBackground] = useState<string>(settings.backgroundImage || 'paper-desktop.jpg');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSelectBackground = (filename: string) => {
        setSelectedBackground(filename);
        updateSettings({
            ...settings,
            backgroundImage: filename,
        });
        showSnackbar(t.settings_saved_successfully || 'Background changed successfully!', 'success');
    };

    return (
        <>
            <Box sx={{ pt: 1 }}>
                <Breadcrumbs
                    items={[
                        { label: t.settings || 'Settings', href: '/settings' },
                        { label: t.select_background || 'Select Background' },
                    ]}
                />
                <Typography variant="h4" component="h1" gutterBottom>
                    {t.select_background || 'Select Background'}
                </Typography>

                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        mb: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <Typography variant="h6" component="h2" gutterBottom>
                        {t.choose_background_image || 'Choose Background Image'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {t.select_background_description || 'Select a background image for your expense tracker'}
                    </Typography>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                            },
                            gap: 2,
                        }}
                    >
                        {backgroundImages.map((bg) => (
                            <Card
                                key={bg.filename}
                                elevation={0}
                                sx={{
                                    position: 'relative',
                                    border: selectedBackground === bg.filename
                                        ? '3px solid rgba(52, 199, 89, 0.8)'
                                        : '1px solid rgba(255, 255, 255, 0.2)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                            >
                                <CardActionArea onClick={() => handleSelectBackground(bg.filename)}>
                                    <Box sx={{ height: 200, overflow: 'hidden' }}>
                                        <CardMedia
                                            component="img"
                                            image={bg.thumbnail}
                                            alt={bg.name}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {bg.name}
                                        </Typography>
                                        {selectedBackground === bg.filename && (
                                            <CheckCircleIcon sx={{ color: 'rgba(52, 199, 89, 0.9)' }} />
                                        )}
                                    </Box>
                                </CardActionArea>
                            </Card>
                        ))}
                    </Box>
                </Paper>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

