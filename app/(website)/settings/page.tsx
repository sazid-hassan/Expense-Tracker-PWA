
'use client';

import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { AppSettings, Currency, Language } from '../../types';
  import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Box,
  Paper,
  SelectChangeEvent,
  Modal,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useTranslation } from '../../hooks/useTranslation';

// iOS-style button configurations
const iosButtonStyle = {
  borderRadius: 3,
  textTransform: 'none' as const,
  fontWeight: 600,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1)',
  color: 'rgba(0, 0, 0, 0.8)',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.1)',
  },
};

const iosButtonStyleError = {
  ...iosButtonStyle,
  background: 'linear-gradient(135deg, rgba(255, 59, 48, 0.3) 0%, rgba(255, 59, 48, 0.1) 100%)',
  border: '1px solid rgba(255, 59, 48, 0.3)',
  color: 'rgba(255, 59, 48, 0.9)',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(255, 59, 48, 0.4) 0%, rgba(255, 59, 48, 0.2) 100%)',
    boxShadow: '0 12px 40px rgba(255, 59, 48, 0.15), 0 4px 12px rgba(255, 59, 48, 0.1)',
    transform: 'translateY(-1px)',
  },
};

const iosButtonStyleSuccess = {
  ...iosButtonStyle,
  background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.3) 0%, rgba(52, 199, 89, 0.1) 100%)',
  border: '1px solid rgba(52, 199, 89, 0.3)',
  color: 'rgba(52, 199, 89, 0.9)',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.4) 0%, rgba(52, 199, 89, 0.2) 100%)',
    boxShadow: '0 12px 40px rgba(52, 199, 89, 0.15), 0 4px 12px rgba(52, 199, 89, 0.1)',
    transform: 'translateY(-1px)',
  },
};

export default function SettingsPage() {
  const { settings, updateSettings, transactions, categories, importData, clearAllData, setLoading, hideLoading } = useStore();
  const [currentSettings, setCurrentSettings] = useState<AppSettings>({
    ...settings,
    language: settings.language || Language.EN, // Ensure language is always defined
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationChecked, setDeleteConfirmationChecked] = useState(false);

  useEffect(() => {
    setCurrentSettings(settings);
  }, [settings]);

  const { t } = useTranslation();

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

  const handleDeleteAllData = () => {
    if (deleteConfirmationChecked) {
      setLoading({ message: t.deleting, variant: 'pulse' });
      
      setTimeout(() => {
        clearAllData();
        hideLoading();
        showSnackbar(t.all_data_deleted_successfully, 'success');
        setIsDeleteModalOpen(false);
        setDeleteConfirmationChecked(false);
      }, 1500);
    } else {
      showSnackbar(t.please_confirm_data_deletion, 'error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentSettings(prev => ({...prev, [name]: value}));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setCurrentSettings(prev => ({...prev, [name]: value}));
  };

  const handleSave = () => {
    updateSettings(currentSettings);
    showSnackbar(t.settings_saved_successfully, 'success');
  };

  const handleExport = () => {
    setLoading({ message: t.exporting, variant: 'pulse' });
    
    setTimeout(() => {
      const data = JSON.stringify({ transactions, categories, settings });
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'expense-tracker-data.json';
      a.click();
      URL.revokeObjectURL(url);
      hideLoading();
      showSnackbar('Data exported successfully!', 'success');
    }, 500);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading({ message: t.importing, variant: 'dots' });
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          
          setTimeout(() => {
            importData(data);
            hideLoading();
            showSnackbar(t.data_imported_successfully, 'success');
          }, 1000);
        } catch (error) {
          hideLoading();
          showSnackbar(t.failed_to_import_data, 'error');
          console.error('Failed to import data:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
    <Box sx={{ pt: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t.settings}
      </Typography>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {t.user_preferences}
        </Typography>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label={t.user_name}
            name="userName"
            value={currentSettings.userName}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="currency-label">{t.currency}</InputLabel>
            <Select
              labelId="currency-label"
              id="currency"
              name="currency"
              value={currentSettings.currency}
              onChange={handleSelectChange}
              label={t.currency}
            >
              {Object.values(Currency).map((currencyValue) => (
                <MenuItem key={currencyValue} value={currencyValue}>
                  {currencyValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="language-label">{t.language}</InputLabel>
            <Select
              labelId="language-label"
              id="language"
              name="language"
              value={currentSettings.language}
              onChange={handleSelectChange}
              label={t.language}
            >
              {Object.values(Language).map((langValue) => (
                <MenuItem key={langValue} value={langValue}>
                  {langValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button 
          variant="contained" 
          onClick={handleSave}
          sx={iosButtonStyle}
        >
          {t.save_settings}
        </Button>
      </Paper>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {t.data_management}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleExport}
            sx={iosButtonStyleSuccess}
          >
            {t.export_data}
          </Button>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
            id="import-file"
          />
          <label htmlFor="import-file">
            <Button 
              variant="contained" 
              component="span"
              sx={iosButtonStyle}
            >
              {t.import_data}
            </Button>
          </label>
        </Box>
        <Button 
          variant="contained" 
          onClick={() => setIsDeleteModalOpen(true)}
          sx={iosButtonStyleError}
        >
          {t.delete_all_data}
        </Button>
      </Paper>

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        aria-labelledby="delete-all-data-modal-title"
        aria-describedby="delete-all-data-modal-description"
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(4px)',
          }
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
          borderRadius: 2,
          p: 4,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
            pointerEvents: 'none',
            zIndex: -1,
            borderRadius: 'inherit',
          },
        }}>
          <Typography id="delete-all-data-modal-title" variant="h6" component="h2" gutterBottom>
            {t.confirm_delete_all_data}
          </Typography>
          <Typography id="delete-all-data-modal-description" sx={{ mt: 2, mb: 2 }}>
            {t.delete_all_data_message}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={deleteConfirmationChecked}
                onChange={(e) => setDeleteConfirmationChecked(e.target.checked)}
                name="deleteConfirmation"
                color="primary"
              />
            }
            label={t.i_understand_and_wish_to_continue}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setIsDeleteModalOpen(false)}
              sx={iosButtonStyle}
            >
              {t.cancel}
            </Button>
            <Button 
              variant="contained" 
              onClick={handleDeleteAllData}
              sx={iosButtonStyleError}
            >
              {t.delete_all_data}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
      <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
    </>
  );
}
