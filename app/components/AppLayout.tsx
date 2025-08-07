'use client';

import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
  Box,
  Fab,
  Snackbar,
  Alert,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from '../hooks/useTranslation';
import TransactionModal from './TransactionModal';
import GlobalLoader from './GlobalLoader';
import { Transaction } from '../types';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const pathname = usePathname();
  const [bottomNavValue, setBottomNavValue] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [transaction, setTransaction] = useState<Omit<Transaction, 'id'> | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  // Update bottom navigation value based on current route
  useEffect(() => {
    switch (pathname) {
      case '/':
        setBottomNavValue(0);
        break;
      case '/categories':
        setBottomNavValue(1);
        break;
      case '/transactions':
        setBottomNavValue(2);
        break;
      case '/settings':
        setBottomNavValue(3);
        break;
      default:
        setBottomNavValue(0);
    }
  }, [pathname]);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleModalOpen = () => {
    setTransaction(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} href="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            {t.expense_tracker}
          </Typography>
          {!isMobile && (
            <Box>
              <Button color="inherit" component={Link} href="/categories">{t.categories}</Button>
              <Button color="inherit" component={Link} href="/transactions">{t.transactions}</Button>
              <Button color="inherit" component={Link} href="/settings">{t.settings}</Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ pb: isMobile ? '80px' : 0 }}>
        {children}
      </Container>
      
      {/* Bottom Navigation for Mobile */}
      {isMobile && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
          <BottomNavigation
            value={bottomNavValue}
            onChange={(event, newValue) => {
              setBottomNavValue(newValue);
            }}
            showLabels
          >
            <BottomNavigationAction
              label={t.home || 'Home'}
              icon={<HomeIcon />}
              component={Link}
              href="/"
            />
            <BottomNavigationAction
              label={t.categories}
              icon={<CategoryIcon />}
              component={Link}
              href="/categories"
            />
            <BottomNavigationAction
              label={t.transactions}
              icon={<AccountBalanceWalletIcon />}
              component={Link}
              href="/transactions"
            />
            <BottomNavigationAction
              label={t.settings}
              icon={<SettingsIcon />}
              component={Link}
              href="/settings"
            />
          </BottomNavigation>
        </Paper>
      )}
      
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: isMobile ? 72 : 16,
          right: 16,
          zIndex: 1001,
          touchAction: 'manipulation',
          pointerEvents: 'auto',
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
        onClick={handleModalOpen}
      >
        <AddIcon />
      </Fab>
      {modalOpen && (
        <TransactionModal
          open={modalOpen}
          onClose={handleModalClose}
          transaction={transaction}
          showSnackbar={showSnackbar}
        />
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <GlobalLoader />
    </>
  );
}
