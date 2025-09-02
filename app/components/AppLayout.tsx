'use client';

import Link from 'next/link';
import {
  AppBar,
  Toolbar,
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
  Typography,
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
import Sidebar from './Sidebar';
import { Transaction } from '../types';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const pathname = usePathname();
  const [bottomNavValue, setBottomNavValue] = useState(0);

  // Get page title based on current route
  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return t.home || 'Dashboard';
      case '/categories':
        return t.categories || 'Categories';
      case '/transactions':
        return t.transactions || 'Transactions';
      case '/settings':
        return t.settings || 'Settings';
      default:
        return t.expense_tracker || 'Expense Tracker';
    }
  };

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
      <Box 
        sx={{ 
          display: 'flex',
          minHeight: '100vh',
          backgroundImage: isMobile 
            ? 'url(/paper-mobile.jpg)' 
            : 'url(/paper-desktop.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Desktop Sidebar */}
        {!isMobile && <Sidebar />}
        
        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          {/* iOS-style AppBar for mobile */}
          {isMobile && (
            <AppBar 
              position="static"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05) !important',
                backdropFilter: 'blur(25px) saturate(200%)',
                WebkitBackdropFilter: 'blur(25px) saturate(200%)',
                borderBottom: '0.5px solid rgba(255, 255, 255, 0.15)',
                boxShadow: 'none',
                color: 'rgba(0, 0, 0, 0.9)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <Toolbar 
                sx={{ 
                  minHeight: '44px !important',
                  height: '44px',
                  paddingTop: 'env(safe-area-inset-top, 0px)',
                  paddingX: 2,
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Typography 
                  variant="h6" 
                  component="h1"
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '17px',
                    lineHeight: '22px',
                    color: 'rgba(0, 0, 0, 0.9)',
                    textAlign: 'center',
                    letterSpacing: '-0.41px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    textShadow: '0 1px 3px rgba(255, 255, 255, 0.9), 0 0 10px rgba(255, 255, 255, 0.5)',
                  }}
                >
                  {getPageTitle()}
                </Typography>
              </Toolbar>
            </AppBar>
          )}
          
          {/* Content Container */}
          <Container 
            sx={{ 
              pb: isMobile ? '80px' : 2,
              pt: 2,
              flexGrow: 1,
            }}
          >
            {children}
          </Container>
        </Box>
      </Box>
      
      {/* Bottom Navigation for Mobile */}
      {isMobile && (
        <Paper 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }} 
          elevation={0}
        >
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
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1)',
          color: 'rgba(0, 0, 0, 0.8)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.1)',
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
