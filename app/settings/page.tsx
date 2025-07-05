
'use client';

import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { AppSettings, Currency, Language } from '../types';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, Box, Paper, SelectChangeEvent } from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';

export default function SettingsPage() {
  const { settings, updateSettings, transactions, categories, importData } = useStore();
  const [currentSettings, setCurrentSettings] = useState<AppSettings>({
    ...settings,
    language: settings.language || Language.EN, // Ensure language is always defined
  });

  useEffect(() => {
    setCurrentSettings(settings);
  }, [settings]);

  const { t } = useTranslation();

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
  };

  const handleExport = () => {
    const data = JSON.stringify({ transactions, categories, settings });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expense-tracker-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          importData(data);
          alert(t.data_imported_successfully);
        } catch (error) {
          alert(t.failed_to_import_data);
          console.error('Failed to import data:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
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
        <Button variant="contained" onClick={handleSave}>
          {t.save_settings}
        </Button>
      </Paper>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {t.data_management}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="contained" color="success" onClick={handleExport}>
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
            <Button variant="contained" component="span" color="primary">
              {t.import_data}
            </Button>
          </label>
        </Box>
      </Paper>
    </Box>
  );
}
